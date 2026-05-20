'use client';

import { createContext, useState } from 'react';
import { quotes as initialQuotes, type Quote } from '@/quotes';
import { getRandomNumber } from '@/utils/helper-functions';
import { useUser } from "@auth0/nextjs-auth0/client";

interface QuotesContextInterface {
  quotes: Quote[];
  quoteIndex: number;
  handleQuoteIndexUpdate: () => void;
  handleLikeQuote: () => void;
}

const InitialQuotesContext = {
  quotes: [],
  quoteIndex: 0,
  handleQuoteIndexUpdate: () => console.log(''),
  handleLikeQuote: () => console.log(''),
};

export const QuotesContext =
  createContext<QuotesContextInterface>(InitialQuotesContext);

export function QuotesContextProvider({ children }) {
  const { user } = useUser();
  console.log('user', user);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState(initialQuotes);

  function handleQuoteIndexUpdate() {
    const nextIndex = getRandomNumber(0, quotes.length - 1);
    setQuoteIndex(nextIndex);
  }

  function handleLikeQuote() {
    const updatedQuotes = quotes.map((quote, id) => {
      if (id === quoteIndex) {
        const updatedLikedBy =
          typeof quote.likedBy === 'number' ? quote.likedBy++ : 1;
        return { ...quote, likedBy: updatedLikedBy };
      }
      return quote;
    });

    setQuotes(updatedQuotes);
  }

  return (
    <QuotesContext
      value={{ quotes, quoteIndex, handleQuoteIndexUpdate, handleLikeQuote }}
    >
      {children}
    </QuotesContext>
  );
}
