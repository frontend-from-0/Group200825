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
import { addNewQuote } from './action';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { AddNewQuoteState, NewQuoteInput, newQuoteSchema } from '@/types/quotes';

const initialAddNewQuoteState: AddNewQuoteState = {
  success: false,
};

export default function AddNewQuotePage() {
  const [state, dispatchAction, isPending] = useActionState<
    AddNewQuoteState,
    FormData
  >(addNewQuote, initialAddNewQuoteState);

  const {
    register,
    formState: { errors: clientSideErrors },
  } = useForm<NewQuoteInput>({
    mode: 'onBlur',
		resolver: zodResolver(newQuoteSchema)
  });

  if (isPending) return <p>Loading...</p>;

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
                {/* Uncontrolled input */}
                <Input
                  type='text'
                  id='author'
                  placeholder='Evil Rabbit'
                  aria-invalid={!!state.errors?.fieldErrors?.author}
                  defaultValue={state.data?.author}
                  {...register('author')}
                />
                {/* TODO: add other aria attributes like aria-describedby and aria-live */}
                {state.errors?.fieldErrors?.author && (
                  <FieldError errors={state.errors?.fieldErrors?.author}>
                    {state.errors?.fieldErrors?.author}
                  </FieldError>
                )}

                {clientSideErrors.author && (
                  <FieldError errors={clientSideErrors.author.message}>
                    {clientSideErrors.author.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor='quote'>Quote</FieldLabel>
                <Textarea
                  id='quote'
                  className='resize-none'
                  aria-invalid={!!state.errors?.fieldErrors?.quote}
                  defaultValue={state.data?.quote}
									{...register('quote')}
                />
                {state.errors?.fieldErrors?.quote && (
                  <FieldError errors={state.errors?.fieldErrors?.quote}>
                    {state.errors?.fieldErrors?.quote}
                  </FieldError>
                )}
								{clientSideErrors.quote && (
                  <FieldError errors={clientSideErrors.quote.message}>
                    {clientSideErrors.quote.message}
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
