'use client';

import type { AnyFieldApi } from '@tanstack/react-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthFormFieldProps = {
    field: AnyFieldApi;
    label: string;
    type?: React.ComponentProps<'input'>['type'];
    placeholder?: string;
    autoComplete?: React.ComponentProps<'input'>['autoComplete'];
    helperText?: string;
};

function errorMessage(error: unknown): string {
    if (typeof error === 'string') return error;

    if (error && typeof error === 'object' && 'message' in error) return String(error.message);

    return 'Invalid value.';
}

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
        <div className='space-y-1.5'>
            <Label htmlFor={field.name}>{label}</Label>
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
            {hasError ? (
                <p className='text-xs text-destructive'>{errors.map(errorMessage).join(', ')}</p>
            ) : (
                helperText && <p className='text-xs text-muted-foreground'>{helperText}</p>
            )}
        </div>
    );
}
