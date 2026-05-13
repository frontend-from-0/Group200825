'use server';

import { auth0 } from '@/lib/auth0';
import { AddNewQuoteState, newQuoteSchema } from '@/types/quotes';
import z from 'zod';

export async function addNewQuote(
  _currentState: AddNewQuoteState,
  formData: FormData,
): Promise<AddNewQuoteState> {
  const session = await auth0.getSession();

  if (!session) {
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
    // TODO: connect to DB to save the data
    return {
      success: true,
    };
  }
}
