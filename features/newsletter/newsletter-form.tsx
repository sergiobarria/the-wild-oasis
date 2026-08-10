'use client';

import { useState } from 'react';

import { useForm } from '@tanstack/react-form';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';

import { newsletterDefaultValues, newsletterSchema } from './newsletter-domain';

export function NewsletterForm() {
    const subscribe = useMutation(api.subscribers.subscribe);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: newsletterDefaultValues,
        validators: { onChange: newsletterSchema },
        onSubmit: async ({ value, formApi }) => {
            setError(null);

            try {
                await subscribe(value);
                toast.success('You are subscribed!');
                formApi.reset();
            } catch (thrown) {
                setError(
                    thrown instanceof ConvexError && typeof thrown.data === 'string'
                        ? thrown.data
                        : 'Something went wrong subscribing. Please try again.',
                );
            }
        },
    });

    return (
        <form
            className='flex flex-col gap-2'
            onSubmit={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                await form.handleSubmit();
            }}
        >
            <label htmlFor='newsletter-email' className='text-sm font-medium text-foreground'>
                Newsletter
            </label>
            <div className='flex gap-2'>
                <form.Field name='email'>
                    {(field) => (
                        <Input
                            id='newsletter-email'
                            type='email'
                            placeholder='you@example.com'
                            className='flex-1'
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                        />
                    )}
                </form.Field>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button type='submit' disabled={!canSubmit || isSubmitting}>
                            {isSubmitting ? 'Subscribing…' : 'Subscribe'}
                        </Button>
                    )}
                </form.Subscribe>
            </div>

            {error && (
                <p role='alert' className='text-sm text-destructive'>
                    {error}
                </p>
            )}
        </form>
    );
}
