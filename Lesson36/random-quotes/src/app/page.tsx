'use client';

import { useContext } from 'react';
import { QuotesContext } from '@/app/QuotesContext';
import { QuoteCard } from '@/app/QuoteCard';

export default function Home() {
  const { quotes, quoteIndex, handleQuoteIndexUpdate, handleLikeQuote } =
    useContext(QuotesContext);
  const { quote, author, likedBy } = quotes[quoteIndex];

  return (
    <main className='min-h-screen flex items-center justify-center'>
      <QuoteCard
        handleLikeQuote={handleLikeQuote}
        likedBy={likedBy}
        quote={quote}
        author={author}
        handleQuoteIndexUpdate={handleQuoteIndexUpdate}
      />
    </main>
  );
}
