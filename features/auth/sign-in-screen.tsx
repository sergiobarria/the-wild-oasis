'use client';

import { useState } from 'react';

import type { Route } from 'next';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { focusFirstInvalidField } from '@/lib/focus-first-invalid-field';
import { APP_ROUTES } from '@/lib/routes';
import { SITE_CONFIG } from '@/lib/site-config';
import { isAdmin } from '@/lib/user-roles';

import { signInWithEmail } from './auth-api';
import { sanitizeRedirectPath, signInDefaultValues, signInSchema } from './auth-domain';
import { AuthFormField } from './components/auth-form-field';

const FIELD_ORDER = ['email', 'password'] as const;

export function SignInScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formError, setFormError] = useState<string | null>(null);

    const explicitRedirectTo = searchParams.get('redirectTo');
    // Explicit redirectTo (e.g. bounced off a protected route, or returning to a
    // booking flow) always wins. Only the *default* destination is role-aware.
    const redirectTo = explicitRedirectTo
        ? sanitizeRedirectPath(explicitRedirectTo, APP_ROUTES.GUEST_AREA)
        : null;

    const form = useForm({
        defaultValues: signInDefaultValues,
        // onChange, not onBlur -- see the comment on SignUpScreen's form for why.
        validators: { onChange: signInSchema },
        onSubmit: async ({ value }) => {
            setFormError(null);
            const { data, error } = await signInWithEmail(value);

            if (error) {
                setFormError(error.message ?? 'Invalid email or password.');
                return;
            }

            const destination =
                redirectTo ?? (isAdmin(data.user.role) ? APP_ROUTES.ADMIN : APP_ROUTES.GUEST_AREA);
            router.push(destination as Route);
        },
    });

    return (
        <div className='space-y-6'>
            <div className='space-y-1.5 text-center'>
                <h1 className='text-2xl font-semibold'>Sign in</h1>
                <p className='text-sm text-muted-foreground'>Welcome back to {SITE_CONFIG.NAME}.</p>
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

                <form.Field name='password'>
                    {(field) => (
                        <AuthFormField
                            field={field}
                            label='Password'
                            type='password'
                            placeholder='••••••••'
                            autoComplete='current-password'
                        />
                    )}
                </form.Field>

                <div className='text-right text-sm'>
                    <Link
                        href={APP_ROUTES.FORGOT_PASSWORD}
                        className='text-muted-foreground underline underline-offset-4 hover:text-foreground'
                    >
                        Forgot password?
                    </Link>
                </div>

                {formError && <p className='text-sm text-destructive'>{formError}</p>}

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? 'Signing in…' : 'Sign in'}
                        </Button>
                    )}
                </form.Subscribe>
            </form>

            <p className='text-center text-sm text-muted-foreground'>
                Don&apos;t have an account?{' '}
                <Link
                    href={APP_ROUTES.SIGN_UP}
                    className='font-medium text-foreground underline underline-offset-4'
                >
                    Create one
                </Link>
            </p>
        </div>
    );
}
