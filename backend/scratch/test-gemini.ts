import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;
  const genAI = new GoogleGenerativeAI(apiKey);

  const modelsToTest = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-2.5-pro'];
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello!');
      console.log(`✅ Success for ${modelName}:`, result.response.text());
      break; // Stop at first success
    } catch (err: any) {
      console.error(`❌ Failed for ${modelName}:`, err.message || err);
    }
  }
}

test();
