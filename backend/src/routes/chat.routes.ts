import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { getRelevantContext } from '../lib/rag';

const router = Router();

// POST /api/v1/chat
router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as {
      messages: { role: 'user' | 'model'; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        reply: "Hi! I'm Nova, your NovaShop assistant. The AI service isn't configured yet — but I can tell you we carry Electronics, Fashion, Home & Living, Sports & Fitness, Outdoor, and Beauty products. Browse our store to explore!",
      });
    }

    // Get the user's latest query
    const latestUserMessage = messages[messages.length - 1].content;

    // Fetch relevant context using RAG
    console.log(`Fetching RAG context for query: "${latestUserMessage}"`);
    const relevantContext = await getRelevantContext(latestUserMessage);

    const systemPrompt = `You are Nova, the friendly and knowledgeable AI shopping assistant for NovaShop — a premium online store.

STORE INFORMATION:
- Name: NovaShop
- Tagline: "Shop the Future"
- Return Policy: 30-day hassle-free returns on all items
- Shipping: Free shipping on orders over $50
- Payment: All major credit cards, PayPal, and Apple Pay accepted

RELEVANT PRODUCTS & CATEGORIES (from store database):
${relevantContext}

YOUR ROLE:
- Help customers find the right products based on their needs and budget
- Answer questions about prices, availability, product features, and specifications
- Suggest alternatives if a product is out of stock
- Be concise, friendly, and helpful
- Format prices clearly (e.g., $279.99)
- If asked about something outside the store, politely redirect to store topics
- Never make up products that aren't in the list above
- Keep responses concise — 2-4 sentences max unless detail is needed`;

    const ai = new GoogleGenAI({ apiKey });

    // Filter messages to make sure the first message in contents is from 'user'
    // Gemini API requires the first message to have the role 'user'
    const firstUserIdx = messages.findIndex(m => m.role === 'user');
    const cleanMessages = firstUserIdx !== -1 ? messages.slice(firstUserIdx) : messages;

    // Format messages for @google/genai format
    const formattedMessages = cleanMessages.slice(-10).map((m: any) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    console.log("Calling Gemini model...");
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ success: true, reply: response.text });
  } catch (err: any) {
    console.error('Chat error:', err.message || err);
    res.status(500).json({ success: false, message: 'Chat service temporarily unavailable' });
  }
});

export default router;
