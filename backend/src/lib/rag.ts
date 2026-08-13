import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let ai: GoogleGenAI | null = null;
let documents: { id: string, name: string, content: string }[] = [];
let documentEmbeddings: number[][] = [];

function cosineSimilarity(a: number[], b: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function initializeVectorStore() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Vector store initialization skipped.");
    return;
  }

  ai = new GoogleGenAI({ apiKey });

  console.log("Fetching products and categories for RAG...");
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isVisible: true },
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        discount: true,
        stock: true,
        description: true,
        brand: true,
        tags: true,
        category: { select: { name: true } },
      },
    }),
    prisma.category.findMany({ select: { name: true, description: true } }),
  ]);

  documents = products.map((p) => {
    const content = `Product Name: ${p.name}\nBrand: ${p.brand}\nCategory: ${p.category.name}\nPrice: $${p.price}\nOriginal Price: $${p.originalPrice || 'N/A'}\nDiscount: ${p.discount || 0}%\nStock: ${p.stock}\nTags: ${p.tags.join(', ')}\nDescription: ${p.description}`;
    return { id: p.id, name: p.name, content };
  });
  
  const categoryDocs = categories.map((c, i) => {
      const content = `Category Name: ${c.name}\nDescription: ${c.description || ''}`;
      return { id: `cat-${i}`, name: c.name, content };
  });

  documents.push(...categoryDocs);

  console.log("Generating embeddings and building vector store...");
  const texts = documents.map(d => d.content);
  
  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: texts,
    });
    
    // The new @google/genai SDK returns embeddings in response.embeddings[i].values
    documentEmbeddings = (response.embeddings || []).map((e: any) => e.values || []);
    console.log(`Initialized VectorStore with ${documents.length} documents.`);
  } catch (error) {
    console.error("Failed to generate embeddings:", error);
  }
}

export async function getRelevantContext(query: string, k: number = 5): Promise<string> {
  if (documents.length === 0 || !ai) {
    await initializeVectorStore();
    if (documents.length === 0) return "No store data available.";
  }
  
  try {
    const response = await ai!.models.embedContent({
      model: 'gemini-embedding-2',
      contents: [query]
    });
    
    const queryEmbedding = (response.embeddings && response.embeddings[0] && response.embeddings[0].values) ? response.embeddings[0].values : [];
    
    if (queryEmbedding.length === 0) {
        return "Error fetching context.";
    }
    
    const scoredDocs = documents.map((doc, i) => ({
        doc,
        score: cosineSimilarity(queryEmbedding, documentEmbeddings[i] || [])
    }));
    
    scoredDocs.sort((a, b) => b.score - a.score);
    
    return scoredDocs.slice(0, k).map((item, idx) => `--- Result ${idx + 1} ---\n${item.doc.content}`).join('\n\n');
  } catch (error) {
    console.error("Error during similarity search:", error);
    return "Error fetching context.";
  }
}
