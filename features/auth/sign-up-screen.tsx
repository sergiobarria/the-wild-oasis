'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { APP_ROUTES } from '@/lib/routes';

import { signUpWithEmail } from './auth-api';
import { AUTH_PASSWORD_MIN_LENGTH, signUpDefaultValues, signUpSchema } from './auth-domain';
import { AuthFormField } from './components/auth-form-field';
import { focusFirstInvalidField } from './focus-first-invalid-field';

const FIELD_ORDER = [
    'firstName',
    'lastName',
    'email',
    'password',
    'confirmPassword',
    'acceptTerms',
] as const;

export function SignUpScreen() {
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: signUpDefaultValues,
        // onChange (not onBlur) so validity never goes stale relative to the
        // latest values -- e.g. blurring email while password is still empty
        // must not leave a permanent "required" error on password once it's
        // filled in without being blurred again. Errors still only *display*
        // once a field is touched (see AuthFormField), so this doesn't
        // reintroduce per-keystroke error noise.
        validators: { onChange: signUpSchema },
        onSubmit: async ({ value }) => {
            setFormError(null);
            const { error } = await signUpWithEmail(value);

            if (error) {
                setFormError(error.message ?? 'Something went wrong. Please try again.');
                return;
            }

            router.push(APP_ROUTES.GUEST_AREA);
        },
    });

    return (
        <div className='space-y-6'>
            <div className='space-y-1.5 text-center'>
                <h1 className='text-2xl font-semibold'>Create an account</h1>
                <p className='text-sm text-muted-foreground'>Start planning your next stay.</p>
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
                <div className='grid grid-cols-2 gap-4'>
                    <form.Field name='firstName'>
                        {(field) => (
                            <AuthFormField
                                field={field}
                                label='First name'
                                placeholder='Jamie'
                                autoComplete='given-name'
                            />
                        )}
                    </form.Field>
                    <form.Field name='lastName'>
                        {(field) => (
                            <AuthFormField
                                field={field}
                                label='Last name'
                                placeholder='Alder'
                                autoComplete='family-name'
                            />
                        )}
                    </form.Field>
                </div>

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
                            autoComplete='new-password'
                            helperText={`Use at least ${AUTH_PASSWORD_MIN_LENGTH} characters.`}
                        />
                    )}
                </form.Field>

                <form.Field name='confirmPassword'>
                    {(field) => (
                        <AuthFormField
                            field={field}
                            label='Confirm password'
                            type='password'
                            placeholder='••••••••'
                            autoComplete='new-password'
                        />
                    )}
                </form.Field>

                <form.Field name='acceptTerms'>
                    {(field) => {
                        const hasError =
                            field.state.meta.errors.length > 0 && field.state.meta.isTouched;

                        return (
                            <div className='space-y-1.5'>
                                <div className='flex items-center gap-2'>
                                    <Checkbox
                                        id={field.name}
                                        checked={field.state.value}
                                        aria-invalid={hasError}
                                        onCheckedChange={(checked) => {
                                            field.handleChange(checked);
                                            // A checkbox click is a complete, atomic action --
                                            // force an immediate re-validation (the whole-form
                                            // onBlur validator otherwise leaves this field's
                                            // stale pre-click error in place until some other
                                            // field is next blurred).
                                            field.handleBlur();
                                        }}
                                        onBlur={field.handleBlur}
                                    />
                                    <Label htmlFor={field.name} className='text-sm font-normal'>
                                        I agree to the{' '}
                                        <Link
                                            href={APP_ROUTES.TERMS}
                                            className='underline underline-offset-4'
                                        >
                                            terms
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href={APP_ROUTES.PRIVACY}
                                            className='underline underline-offset-4'
                                        >
                                            privacy policy
                                        </Link>
                                        .
                                    </Label>
                                </div>
                                {hasError && (
                                    <p className='text-xs text-destructive'>
                                        You must accept the terms to continue.
                                    </p>
                                )}
                            </div>
                        );
                    }}
                </form.Field>

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
                            {isSubmitting ? 'Creating account…' : 'Create account'}
                        </Button>
                    )}
                </form.Subscribe>
            </form>

            <p className='text-center text-sm text-muted-foreground'>
                Already have an account?{' '}
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
