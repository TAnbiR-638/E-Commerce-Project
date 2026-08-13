import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const prisma = new PrismaClient();

// POST /api/v1/chat
router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as {
      messages: { role: 'user' | 'model'; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'messages array is required' });
    }

    // ── Fetch live store data ──────────────────────────────────────
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isVisible: true },
        select: {
          name: true,
          price: true,
          originalPrice: true,
          discount: true,
          stock: true,
          rating: true,
          reviewCount: true,
          brand: true,
          tags: true,
          isFeatured: true,
          isBestSeller: true,
          isNew: true,
          category: { select: { name: true } },
        },
        orderBy: { isFeatured: 'desc' },
      }),
      prisma.category.findMany({ select: { name: true, description: true } }),
    ]);

    // ── Build system prompt ────────────────────────────────────────
    const productList = products
      .map(p => {
        const disc = p.discount ? ` (${p.discount}% off, was $${p.originalPrice})` : '';
        const stock = p.stock === 0 ? ' [OUT OF STOCK]' : p.stock <= 10 ? ` [Low stock: ${p.stock} left]` : ` [In stock: ${p.stock}]`;
        const badges = [p.isFeatured && 'Featured', p.isBestSeller && 'Best Seller', p.isNew && 'New'].filter(Boolean).join(', ');
        return `• ${p.name} | Brand: ${p.brand} | Category: ${p.category.name} | Price: $${p.price}${disc}${stock} | Rating: ${p.rating}★ (${p.reviewCount} reviews)${badges ? ` | ${badges}` : ''}`;
      })
      .join('\n');

    const categoryList = categories
      .map(c => `• ${c.name}${c.description ? ': ' + c.description : ''}`)
      .join('\n');

    const systemPrompt = `You are Nova, the friendly and knowledgeable AI shopping assistant for NovaShop — a premium online store.

STORE INFORMATION:
- Name: NovaShop
- Tagline: "Shop the Future"
- Return Policy: 30-day hassle-free returns on all items
- Shipping: Free shipping on orders over $50
- Payment: All major credit cards, PayPal, and Apple Pay accepted

PRODUCT CATEGORIES:
${categoryList}

CURRENT PRODUCTS (live inventory):
${productList}

YOUR ROLE:
- Help customers find the right products based on their needs and budget
- Answer questions about prices, availability, product features, and specifications
- Suggest alternatives if a product is out of stock
- Be concise, friendly, and helpful
- Format prices clearly (e.g., $279.99)
- If asked about something outside the store, politely redirect to store topics
- Never make up products that aren't in the list above
- Keep responses concise — 2-4 sentences max unless detail is needed`;

    // ── Call Gemini ────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful no-key fallback
      return res.json({
        success: true,
        reply: "Hi! I'm Nova, your NovaShop assistant. The AI service isn't configured yet — but I can tell you we carry Electronics, Fashion, Home & Living, Sports & Fitness, Outdoor, and Beauty products. Browse our store to explore!",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    // Convert message history to Gemini format (last 10 messages)
    const history = messages.slice(0, -1).slice(-9).map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: systemPrompt,
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const reply = result.response.text();

    res.json({ success: true, reply });
  } catch (err: any) {
    console.error('Chat error:', err.message);
    res.status(500).json({ success: false, message: 'Chat service temporarily unavailable' });
  }
});

export default router;
