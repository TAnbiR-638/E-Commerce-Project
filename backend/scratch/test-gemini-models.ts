import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = (await res.json()) as { models: { name: string }[] };
    if (data.models) {
      console.log('Available Model Names:');
      data.models.forEach(m => console.log(' -', m.name));
    } else {
      console.log('No models returned. Response:', JSON.stringify(data));
    }
  } catch (err: any) {
    console.error('Fetch error:', err);
  }
}

listModels();
