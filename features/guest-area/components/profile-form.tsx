'use client';

import { useState } from 'react';

import { useForm } from '@tanstack/react-form';
import { useQuery } from 'convex/react';
import { toast } from 'sonner';

import { FormFieldShell } from '@/components/form-field-shell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { AuthFormField } from '@/features/auth/components/auth-form-field';
import { focusFirstInvalidField } from '@/lib/focus-first-invalid-field';
import { splitName } from '@/lib/names';

import { updateProfile } from '../profile-api';
import { profileFormSchema } from '../profile-domain';

const FIELD_ORDER = ['firstName', 'lastName', 'phone'] as const;

type CurrentUser = { name: string; email: string; phone?: string | null };

export function ProfileForm() {
    const user = useQuery(api.auth.getCurrentUser, {});

    if (user === undefined) {
        return <Skeleton className='h-64 w-full max-w-md rounded-lg' />;
    }

    // The guest-area layout already calls requireUser() server-side -- this is only ever
    // reached signed in, but the query itself can still return null for a brief instant.
    if (user === null) return null;

    return <ProfileFormFields user={user} />;
}

function ProfileFormFields({ user }: { user: CurrentUser }) {
    const [formError, setFormError] = useState<string | null>(null);
    const { firstName, lastName } = splitName(user.name);

    const form = useForm({
        defaultValues: { firstName, lastName, phone: user.phone ?? '' },
        validators: { onChange: profileFormSchema },
        onSubmit: async ({ value }) => {
            setFormError(null);
            const { error } = await updateProfile(value);

            if (error) {
                setFormError(error.message ?? 'Something went wrong. Please try again.');
                return;
            }

            toast.success('Profile updated');
        },
    });

    return (
        <form
            className='max-w-md space-y-4'
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
                        <AuthFormField field={field} label='First name' autoComplete='given-name' />
                    )}
                </form.Field>
                <form.Field name='lastName'>
                    {(field) => (
                        <AuthFormField field={field} label='Last name' autoComplete='family-name' />
                    )}
                </form.Field>
            </div>

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

            <FormFieldShell
                id='profile-email'
                label='Email'
                hasError={false}
                errors={[]}
                helperText="Email can't be changed yet."
            >
                <p id='profile-email' className='text-sm text-muted-foreground'>
                    {user.email}
                </p>
            </FormFieldShell>

            {formError && (
                <p role='alert' className='text-sm text-destructive'>
                    {formError}
                </p>
            )}

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                    <Button type='submit' disabled={!canSubmit || isSubmitting}>
                        {isSubmitting ? 'Saving…' : 'Save changes'}
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}
