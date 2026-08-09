'use client';

import type { AnyFieldApi } from '@tanstack/react-form';

import { FormFieldShell } from '@/components/form-field-shell';
import { Textarea } from '@/components/ui/textarea';

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
        <FormFieldShell id={field.name} label={label} hasError={hasError} errors={errors}>
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
        </FormFieldShell>
    );
}
