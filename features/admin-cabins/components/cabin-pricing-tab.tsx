'use client';

import { AuthFormField } from '@/features/auth/components/auth-form-field';

import type { CabinFormApi } from '../use-cabin-form';

export function CabinPricingTab({ form }: { form: CabinFormApi }) {
    return (
        <div className='grid gap-4 sm:grid-cols-2'>
            <form.Field name='nightlyRate'>
                {(field) => (
                    <AuthFormField
                        field={field}
                        label='Nightly rate (USD)'
                        type='number'
                        helperText='Whole dollars, e.g. 250.'
                    />
                )}
            </form.Field>

            <form.Field name='cleaningFee'>
                {(field) => (
                    <AuthFormField
                        field={field}
                        label='Cleaning fee (USD)'
                        type='number'
                        helperText='Whole dollars, e.g. 35.'
                    />
                )}
            </form.Field>

            <form.Field name='maxGuests'>
                {(field) => <AuthFormField field={field} label='Max guests' type='number' />}
            </form.Field>

            <form.Field name='bedrooms'>
                {(field) => <AuthFormField field={field} label='Bedrooms' type='number' />}
            </form.Field>

            <form.Field name='beds'>
                {(field) => <AuthFormField field={field} label='Beds' type='number' />}
            </form.Field>

            <form.Field name='bathrooms'>
                {(field) => <AuthFormField field={field} label='Bathrooms' type='number' />}
            </form.Field>
        </div>
    );
}
