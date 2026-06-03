'use client';

import { createContext, useEffect, useState } from 'react';
import { getRandomNumber } from '@/utils/helper-functions';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Quote } from '@/types/quotes';

interface QuotesContextInterface {
  quotes: Quote[];
  quoteIndex: number;
  isLoading: boolean;
  error: string | null;
  handleQuoteIndexUpdate: () => void;
  handleLikeQuote: () => void;
}

const InitialQuotesContext = {
  quotes: [],
  quoteIndex: 0,
  isLoading: true,
  error: null,
  handleQuoteIndexUpdate: () => console.log(''),
  handleLikeQuote: () => console.log(''),
};

export const QuotesContext =
  createContext<QuotesContextInterface>(InitialQuotesContext);

export function QuotesContextProvider({ children }) {
  const { user } = useUser();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/quotes');
        if (!response.ok) {
          throw new Error('Failed to load quotes');
        }
        const data = await response.json();
        setQuotes(data.quotes);
        setQuoteIndex(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quotes');
        setQuotes([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  function handleQuoteIndexUpdate() {
    if (quotes.length === 0) {
      return;
    }
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
      value={{
        quotes,
        quoteIndex,
        isLoading,
        error,
        handleQuoteIndexUpdate,
        handleLikeQuote,
      }}
    >
      {children}
    </QuotesContext>
  );
}
