'use client';

import { Button } from '@/components/Button';
import { useContext } from 'react';
import { H3 } from '@/components/typography/H3';
import { QuotesContext } from '@/app/QuotesContext';

export default function Home() {
  const { quotes, quoteIndex, handleQuoteIndexUpdate, handleLikeQuote } =
    useContext(QuotesContext);
  const { quote, author, likedBy } = quotes[quoteIndex];

  return (
    <main className='min-h-screen flex items-center justify-center bg-slate-200'>
      <section className='bg-slate-50/50 rounded-md p-10 flex flex-col'>
        <div className='self-end'>
          <Button variant={'icon'} onClick={handleLikeQuote}>❤️ {likedBy ?? 0}</Button>
        </div>
        <H3 element='p'>{quote}</H3>
        <span className='text-md font-semibold text-slate-900 self-end '>
          - {author}
        </span>
        <div className='mt-6 flex flex-col'>
          <Button variant={'primary'} onClick={handleQuoteIndexUpdate}>
            Next Quote
          </Button>
        </div>
      </section>
    </main>
  );
}
