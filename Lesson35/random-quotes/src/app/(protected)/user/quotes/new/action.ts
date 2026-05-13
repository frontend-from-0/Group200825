'use server';

import { auth0 } from '@/lib/auth0';
import z from 'zod';

export type AddNewQuoteState = {
  success: boolean;
  errors?: {
    formErrors: string[];
    fieldErrors: {
      author?: string[];
      quote?: string[];
      [key: string]: string[] | undefined;
    };
  };
  message?: string;
  data?: {
    author: string;
    quote: string;
  };
};

const NewQuote = z.object({
  author: z
    .string()
    .trim()
    .min(2, { message: 'Author name should be at least 2 characters long' })
    .max(50, {
      message:
        'Author name should be 50 characters long maximum. Please try a shorter name.',
    }),
  quote: z
    .string()
    .trim()
    .min(5, { message: 'Quote should be at least 5 characters long' })
    .max(300, {
      message:
        'Quote should be 300 characters long maximum. Please try a shorter one.',
    }),
});

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

  const validationOutput = NewQuote.safeParse(rawData);

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
