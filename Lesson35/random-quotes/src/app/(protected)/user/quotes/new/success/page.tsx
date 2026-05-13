import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewQuoteSuccessPage() {
	return (
		<main className='min-h-screen flex-col justify-items-center pt-20'>
			<div className='max-w-md mx-auto text-center'>
				<h1>
					Thank you for adding a new quote. It&apos;s now sent to administator
					for review.
				</h1>
				<Button className='mt-6'>
					<Link href='/user/quotes/new'>Add another quote</Link>
				</Button>
			</div>
		</main>
	);
}
