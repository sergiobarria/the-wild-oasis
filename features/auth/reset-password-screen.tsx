'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { focusFirstInvalidField } from '@/lib/focus-first-invalid-field';
import { APP_ROUTES } from '@/lib/routes';

import { resetPassword } from './auth-api';
import { resetPasswordDefaultValues, resetPasswordSchema } from './auth-domain';
import { AuthFormField } from './components/auth-form-field';

const FIELD_ORDER = ['password', 'confirmPassword'] as const;

export function ResetPasswordScreen({ token }: { token: string | undefined }) {
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: resetPasswordDefaultValues,
        validators: { onChange: resetPasswordSchema },
        onSubmit: async ({ value }) => {
            setFormError(null);
            const { error } = await resetPassword(value.password, token as string);

            if (error) {
                setFormError(error.message ?? 'That reset link is invalid or has expired.');
                return;
            }

            router.push(APP_ROUTES.SIGN_IN);
        },
    });

    if (!token) {
        return (
            <div className='space-y-4 text-center'>
                <h1 className='text-2xl font-semibold'>Invalid or expired link</h1>
                <p className='text-sm text-muted-foreground'>
                    This password reset link is no longer valid. Request a new one to continue.
                </p>
                <Link
                    href={APP_ROUTES.FORGOT_PASSWORD}
                    className='text-sm font-medium underline underline-offset-4'
                >
                    Request a new link
                </Link>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='space-y-1.5 text-center'>
                <h1 className='text-2xl font-semibold'>Set a new password</h1>
                <p className='text-sm text-muted-foreground'>
                    Choose a new password for your account.
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
                <form.Field name='password'>
                    {(field) => (
                        <AuthFormField
                            field={field}
                            label='New password'
                            type='password'
                            placeholder='••••••••'
                            autoComplete='new-password'
                        />
                    )}
                </form.Field>

                <form.Field name='confirmPassword'>
                    {(field) => (
                        <AuthFormField
                            field={field}
                            label='Confirm new password'
                            type='password'
                            placeholder='••••••••'
                            autoComplete='new-password'
                        />
                    )}
                </form.Field>

                {formError && (
                    <p role='alert' className='text-sm text-destructive'>
                        {formError}
                    </p>
                )}

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? 'Resetting…' : 'Reset password'}
                        </Button>
                    )}
                </form.Subscribe>
            </form>
        </div>
    );
}
