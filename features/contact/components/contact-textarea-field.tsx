'use client';

import type { AnyFieldApi } from '@tanstack/react-form';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { errorMessage } from '@/features/auth/components/auth-form-field';

type ContactTextareaFieldProps = {
    field: AnyFieldApi;
    label: string;
    placeholder?: string;
    rows?: number;
};

/** Same shape as `AuthFormField`, for the one field in this form that needs a multi-line
 *  `Textarea` instead of an `Input`. */
export function ContactTextareaField({
    field,
    label,
    placeholder,
    rows = 6,
}: ContactTextareaFieldProps) {
    const errors = field.state.meta.errors;
    const hasError = errors.length > 0 && field.state.meta.isTouched;

    return (
        <div className='space-y-1.5'>
            <Label htmlFor={field.name}>{label}</Label>
            <Textarea
                id={field.name}
                name={field.name}
                rows={rows}
                placeholder={placeholder}
                value={field.state.value as string}
                aria-invalid={hasError}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
            />
            {hasError && (
                <p className='text-xs text-destructive'>{errors.map(errorMessage).join(', ')}</p>
            )}
        </div>
    );
}
