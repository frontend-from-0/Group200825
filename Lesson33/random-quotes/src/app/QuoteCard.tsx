import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { H3 } from '@/components/typography/H3';

interface QuoteCardProps {
  handleLikeQuote: () => void;
  likedBy?: number;
  quote: string;
  author: string;
  handleQuoteIndexUpdate: () => void;
}

export function QuoteCard({handleLikeQuote, likedBy, quote, author, handleQuoteIndexUpdate}: QuoteCardProps) {
  return (
    <Card size='lg' className='mx-auto w-full max-w-sm'>
      <CardContent className={'flex flex-col'}>
        <div className='self-end'>
          <Button variant={'ghost'} onClick={handleLikeQuote}>
            ❤️ {likedBy ?? 0}
          </Button>
        </div>
        <H3 element='p'>
          {quote}
        </H3>
        <span className='text-md font-semibold text-slate-900 self-end '>
          - {author}
        </span>

        <div className='mt-6 flex flex-col'>
          <Button
            className='w-full'
            onClick={handleQuoteIndexUpdate}
          >
            Next Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
