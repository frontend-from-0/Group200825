import {
  Output,
  generateText,
} from 'ai';

import { assertApiKeyConfigured, getOpenAIModel } from '@/lib/ai';
import { SESSION_SYSTEM_PROMPT } from '@/lib/prompts';
import { productDescriptionRequestSchema, productDescriptionResponseSchema } from '@/types/product';

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    assertApiKeyConfigured();
  } catch {
    return Response.json(
      { error: 'Server is missing OPENAI_API_KEY configuration.' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = productDescriptionRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? 'Invalid request body.';
    return Response.json({ error: message }, { status: 400 });
  }

  const { title } = parsed.data;

  const { output } = generateText({
    model: getOpenAIModel(),
    output: Output.object({ schema: productDescriptionResponseSchema }),
    instructions: SESSION_SYSTEM_PROMPT,
    prompt: `Product title: ${title}.`,
  });


  return output;
}
