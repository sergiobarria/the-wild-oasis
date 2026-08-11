'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { focusFirstInvalidField } from '@/lib/focus-first-invalid-field';
import { APP_ROUTES } from '@/lib/routes';

import { requestPasswordReset } from './auth-api';
import { forgotPasswordDefaultValues, forgotPasswordSchema } from './auth-domain';
import { AuthFormField } from './components/auth-form-field';

const FIELD_ORDER = ['email'] as const;

export function ForgotPasswordScreen() {
    const [submitted, setSubmitted] = useState(false);

    const form = useForm({
        defaultValues: forgotPasswordDefaultValues,
        validators: { onChange: forgotPasswordSchema },
        onSubmit: async ({ value }) => {
            // Better Auth's own response is identical whether or not the email exists (it never
            // leaks that) -- so there's nothing to branch on here, only a generic success state.
            await requestPasswordReset(value.email);
            setSubmitted(true);
        },
    });

    if (submitted) {
        return (
            <div role='status' className='space-y-4 text-center'>
                <h1 className='text-2xl font-semibold'>Check your email</h1>
                <p className='text-sm text-muted-foreground'>
                    If an account exists for that email, we&apos;ve sent a link to reset your
                    password.
                </p>
                <Link
                    href={APP_ROUTES.SIGN_IN}
                    className='text-sm font-medium underline underline-offset-4'
                >
                    Back to sign in
                </Link>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='space-y-1.5 text-center'>
                <h1 className='text-2xl font-semibold'>Forgot your password?</h1>
                <p className='text-sm text-muted-foreground'>
                    Enter your email and we&apos;ll send you a link to reset it.
                </p>
            </div>

            <form
                className='space-y-4'
                onSubmit={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    await form.handleSubmit();
                    focusFirstInvalidField(form, FIELD_ORDER);
                }}
            >
                <form.Field name='email'>
                    {(field) => (
                        <AuthFormField
                            field={field}
                            label='Email'
                            type='email'
                            placeholder='jamie@example.com'
                            autoComplete='email'
                        />
                    )}
                </form.Field>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? 'Sending…' : 'Send reset link'}
                        </Button>
                    )}
                </form.Subscribe>
            </form>

            <p className='text-center text-sm text-muted-foreground'>
                Remembered your password?{' '}
                <Link
                    href={APP_ROUTES.SIGN_IN}
                    className='font-medium text-foreground underline underline-offset-4'
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
