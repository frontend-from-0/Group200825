'use client';

import { createContext, useState } from 'react';
import { quotes as initialQuotes } from '@/quotes';
import {getRandomNumber} from '@/utils/helper-functions';

export const QuotesContext = createContext({});

export function QuotesContextProvider({ children }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState(initialQuotes);

  function handleQuoteIndexUpdate () {
    const nextIndex = getRandomNumber(0, quotes.length-1);
    setQuoteIndex(nextIndex);
  }

  function handleLikeQuote () {
    const updatedQuotes = quotes.map((quote, id) => {
      if (id === quoteIndex) {
        const updatedLikedBy = typeof quote.likedBy === 'number' ? quote.likedBy++ : 1;
        return {...quote, likedBy: updatedLikedBy};
      } 
      return quote;
    });

    setQuotes(updatedQuotes);
  }

  return (<QuotesContext value={{quotes, quoteIndex, handleQuoteIndexUpdate, handleLikeQuote }}>{children}</QuotesContext>);
}
