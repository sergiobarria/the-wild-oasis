'use client';

import { useState } from 'react';

import { useForm } from '@tanstack/react-form';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { AuthFormField } from '@/features/auth/components/auth-form-field';

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
            <div className='flex items-start gap-2'>
                <form.Field name='email'>
                    {(field) => (
                        <div className='flex-1'>
                            <AuthFormField
                                field={field}
                                label='Newsletter'
                                type='email'
                                placeholder='you@example.com'
                                autoComplete='email'
                            />
                        </div>
                    )}
                </form.Field>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type='submit'
                            className='mt-6'
                            disabled={!canSubmit || isSubmitting}
                        >
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
