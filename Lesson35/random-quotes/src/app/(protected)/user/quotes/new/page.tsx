'use client';

import { Button } from '@/components/ui/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useActionState } from 'react';
import { addNewQuote, type AddNewQuoteState } from './action';
import { redirect } from 'next/navigation';

const initialAddNewQuoteState: AddNewQuoteState = {
	success: false,
};

export default function AddNewQuotePage() {
	const [state, dispatchAction, isPending] = useActionState<
		AddNewQuoteState,
		FormData
	>(addNewQuote, initialAddNewQuoteState);

	if (isPending) return <p>Loading...</p>;
  // I've updated the component a little to redirect the user to a success page after the quote is added. This approach is cleaner than the previous one that I tried in the lesson.
	if (state.success) return redirect('/user/quotes/new/success');

	return (
		<main className='min-h-screen flex-col justify-items-center pt-20'>
			<form className='w-full max-w-md' action={dispatchAction}>
				<FieldGroup>
					<FieldSet>
						<FieldLegend>Add A New Quote</FieldLegend>

						<FieldGroup>
							<Field>
								<FieldLabel htmlFor='author'>Author</FieldLabel>
								<Input
									type='text'
									name='author'
									id='author'
									placeholder='Evil Rabbit'
									required
									aria-invalid={!!state.errors?.fieldErrors?.author}
									defaultValue={state.data?.author}
								/>
								{/* TODO: add other aria attributes like aria-describedby and aria-live */}
								{state.errors?.fieldErrors?.author && (
									<FieldError errors={state.errors?.fieldErrors?.author}>
										{state.errors?.fieldErrors?.author}
									</FieldError>
								)}
							</Field>

							<Field>
								<FieldLabel htmlFor='quote'>Quote</FieldLabel>
								<Textarea
									id='quote'
									name='quote'
									className='resize-none'
									aria-invalid={!!state.errors?.fieldErrors?.quote}
									defaultValue={state.data?.quote}
								/>
								{state.errors?.fieldErrors?.quote && (
									<FieldError errors={state.errors?.fieldErrors?.quote}>
										{state.errors?.fieldErrors?.quote}
									</FieldError>
								)}
							</Field>
						</FieldGroup>
					</FieldSet>
					<Field orientation='horizontal'>
						<Button type='submit'>Create</Button>
						<Button variant='outline' type='reset'>
							Clear
						</Button>
					</Field>
				</FieldGroup>
			</form>
			{state.message ? <p className='mt-10'>{state.message}</p> : <></>}
		</main>
	);
}
