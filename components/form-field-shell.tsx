import { Label } from '@/components/ui/label';

function errorMessage(error: unknown): string {
    if (typeof error === 'string') return error;

    if (error && typeof error === 'object' && 'message' in error) return String(error.message);

    return 'Invalid value.';
}

type FormFieldShellProps = {
    id: string;
    label: string;
    hasError: boolean;
    errors: unknown[];
    helperText?: string;
    children: React.ReactNode;
};

/** Shared label + error/helper-text wrapper for a `@tanstack/react-form` field -- the input
 *  itself (an `Input`, `Textarea`, or anything else) is passed as `children` so this stays
 *  agnostic to which control it wraps. */
export function FormFieldShell({
    id,
    label,
    hasError,
    errors,
    helperText,
    children,
}: FormFieldShellProps) {
    return (
        <div className='space-y-1.5'>
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hasError ? (
                <p className='text-xs text-destructive'>{errors.map(errorMessage).join(', ')}</p>
            ) : (
                helperText && <p className='text-xs text-muted-foreground'>{helperText}</p>
            )}
        </div>
    );
}
