'use client';

import { useContext } from 'react';
import { QuotesContext } from '@/app/QuotesContext';
import { QuoteCard } from '@/app/QuoteCard';

export default function Home() {
  const {
    quotes,
    quoteIndex,
    isLoading,
    error,
    handleQuoteIndexUpdate,
    handleLikeQuote,
  } = useContext(QuotesContext);

  if (isLoading) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <p>Loading quotes…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <p>{error}</p>
      </main>
    );
  }

  const currentQuote = quotes[quoteIndex];
  if (!currentQuote) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <p>No quotes yet. Add one or approve quotes in the database.</p>
      </main>
    );
  }

  const { quote, author, likedBy } = currentQuote;

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
