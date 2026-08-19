import { createOpenAI } from '@ai-sdk/openai';

export function getOpenAIModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const openai = createOpenAI({ apiKey });
  return openai('gpt-4o-mini');
}

export function assertApiKeyConfigured(): void {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
}


export async function generateProductDescription(title:string){
  try {
  const response = await fetch('/api/ai', {
    method: "POST",
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(`Failed generation prouct description ${response.status}`)
  }

  const data = await response.json();

  return data.description;
  } catch (error) {
    console.error('Error occured when generation product description', error);
  }
}
