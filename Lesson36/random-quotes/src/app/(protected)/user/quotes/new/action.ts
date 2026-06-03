'use server';

import { auth0 } from '@/lib/auth0';
import { Collections, getDb } from '@/lib/db';
import { AddNewQuoteState, newQuoteSchema } from '@/types/quotes';
import z from 'zod';

export async function addNewQuote(
  _currentState: AddNewQuoteState,
  formData: FormData,
): Promise<AddNewQuoteState> {
  const session = await auth0.getSession();
  const user = session?.user;
  console.log('user', user);

  if (!session || !user) {
    return {
      success: false,
      message: 'Please log in to add a quote.',
    };
  }

  const rawData = {
    author: String(formData.get('author') ?? ''),
    quote: String(formData.get('quote') ?? ''),
  };

  const validationOutput = newQuoteSchema.safeParse(rawData);

  if (!validationOutput.success) {
    const validationErrors = z.flattenError(validationOutput.error);
    console.log('validationErrors', validationErrors);

    return {
      success: false,
      errors: validationErrors,
      data: rawData,
    };
    
  } else {
    const db = await getDb();
    const col = db.collection(Collections.quotes);
    const now = new Date();
    
    const newQuote = {
      quote: validationOutput.data.quote,
      author: validationOutput.data.author,
      createdBy: user.sub, // @Anna To find right docs page in Auth0
      adminApproved: false,
      createdAt: now,
      updatedAt: now
    }

    await col.insertOne(newQuote);

    return {
      success: true,
    };
  }
}
