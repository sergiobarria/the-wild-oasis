'use client';

import type { AnyFieldApi } from '@tanstack/react-form';

import { FormFieldShell } from '@/components/form-field-shell';
import { Input } from '@/components/ui/input';

type AuthFormFieldProps = {
    field: AnyFieldApi;
    label: string;
    type?: React.ComponentProps<'input'>['type'];
    placeholder?: string;
    autoComplete?: React.ComponentProps<'input'>['autoComplete'];
    helperText?: string;
};

export function AuthFormField({
    field,
    label,
    type = 'text',
    placeholder,
    autoComplete,
    helperText,
}: AuthFormFieldProps) {
    const errors = field.state.meta.errors;
    // Whole-form validators re-run on every field's blur, so gate display on
    // this field's own touched state -- otherwise blurring one field can
    // flash an error on a field the user hasn't reached yet.
    const hasError = errors.length > 0 && field.state.meta.isTouched;

    return (
        <FormFieldShell
            id={field.name}
            label={label}
            hasError={hasError}
            errors={errors}
            helperText={helperText}
        >
            <Input
                id={field.name}
                name={field.name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={field.state.value as string}
                aria-invalid={hasError}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
            />
        </FormFieldShell>
    );
}
