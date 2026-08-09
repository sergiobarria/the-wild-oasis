'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useForm } from '@tanstack/react-form';
import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { AuthFormField } from '@/features/auth/components/auth-form-field';
import { focusFirstInvalidField } from '@/lib/focus-first-invalid-field';
import { APP_ROUTES } from '@/lib/routes';

import { ContactTextareaField } from './components/contact-textarea-field';
import { contactDefaultValues, contactSchema } from './contact-domain';

const FIELD_ORDER = ['name', 'email', 'phone', 'subject', 'message'] as const;

export function ContactScreen() {
    const submitMessage = useMutation(api.messages.submit);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    // A bot that auto-fills every field on the page trips this -- a real visitor never
    // sees or fills it (see the visually-hidden wrapper below). Kept out of the
    // TanStack form entirely so it never participates in validation or focus-first logic.
    const [honeypot, setHoneypot] = useState('');

    const form = useForm({
        defaultValues: contactDefaultValues,
        validators: { onChange: contactSchema },
        onSubmit: async ({ value }) => {
            setFormError(null);

            try {
                await submitMessage({ ...value, honeypot });
                setSubmitted(true);
            } catch (thrown) {
                setFormError(
                    thrown instanceof ConvexError && typeof thrown.data === 'string'
                        ? thrown.data
                        : 'Something went wrong sending your message. Please try again.',
                );
            }
        },
    });

    if (submitted) {
        return (
            <div
                role='status'
                className='space-y-4 rounded-lg border border-border p-6 text-center'
            >
                <h2 className='font-heading text-xl font-medium'>Message sent</h2>
                <p className='text-muted-foreground'>
                    Thanks for reaching out -- we&apos;ll get back to you soon.
                </p>
                <Button render={<Link href={APP_ROUTES.CABINS} />} nativeButton={false}>
                    Explore cabins
                </Button>
            </div>
        );
    }

    return (
        <form
            className='space-y-4'
            onSubmit={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                await form.handleSubmit();
                focusFirstInvalidField(form, FIELD_ORDER);
            }}
        >
            <form.Field name='name'>
                {(field) => <AuthFormField field={field} label='Name' autoComplete='name' />}
            </form.Field>

            <form.Field name='email'>
                {(field) => (
                    <AuthFormField field={field} label='Email' type='email' autoComplete='email' />
                )}
            </form.Field>

            <form.Field name='phone'>
                {(field) => (
                    <AuthFormField
                        field={field}
                        label='Phone (optional)'
                        type='tel'
                        autoComplete='tel'
                    />
                )}
            </form.Field>

            <form.Field name='subject'>
                {(field) => <AuthFormField field={field} label='Subject' />}
            </form.Field>

            <form.Field name='message'>
                {(field) => <ContactTextareaField field={field} label='Message' />}
            </form.Field>

            {/* Honeypot -- hidden from sighted and assistive-tech users alike (not `sr-only`,
                which is announced to screen readers and would trip this for a blind visitor).
                Most scraping bots read raw HTML without applying CSS, so they fill it in. */}
            <div
                aria-hidden='true'
                className='absolute top-auto -left-[9999px] h-px w-px overflow-hidden'
            >
                <label htmlFor='company-website'>Leave this field blank</label>
                <input
                    id='company-website'
                    name='companyWebsite'
                    type='text'
                    tabIndex={-1}
                    autoComplete='off'
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                />
            </div>

            {formError && (
                <p role='alert' className='text-sm text-destructive'>
                    {formError}
                </p>
            )}

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                    <Button type='submit' className='w-full' disabled={!canSubmit || isSubmitting}>
                        {isSubmitting ? 'Sending…' : 'Send message'}
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}
