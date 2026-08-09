import { z } from 'zod';

/** Mirrored server-side by `emailAndPassword.minPasswordLength` in convex/betterAuth/auth.ts. */
export const AUTH_PASSWORD_MIN_LENGTH = 8;

export const signUpSchema = z
    .object({
        firstName: z.string().trim().min(1, 'Enter your first name.'),
        lastName: z.string().trim().min(1, 'Enter your last name.'),
        email: z.email('Enter a valid email address.'),
        password: z
            .string()
            .min(AUTH_PASSWORD_MIN_LENGTH, `Use at least ${AUTH_PASSWORD_MIN_LENGTH} characters.`),
        confirmPassword: z.string(),
        acceptTerms: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    })
    .refine((data) => data.acceptTerms, {
        message: 'You must accept the terms to continue.',
        path: ['acceptTerms'],
    });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signUpDefaultValues: SignUpValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
};

export const signInSchema = z.object({
    email: z.email('Enter a valid email address.'),
    password: z.string().min(1, 'Enter your password.'),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const signInDefaultValues: SignInValues = {
    email: '',
    password: '',
};

/**
 * Only ever redirect within this app after sign-in -- an unvalidated
 * `redirectTo` query param is a classic open-redirect vector, so anything
 * that isn't a same-origin relative path falls back to `fallback`.
 *
 * A single slash followed by another slash *or a backslash* is rejected:
 * browsers normalize `\` to `/` when resolving a URL, so `/\evil.com` is
 * just as much a protocol-relative absolute URL as `//evil.com` is.
 */
export function sanitizeRedirectPath(path: string | null, fallback: string): string {
    if (!path) return fallback;

    if (!/^\/(?![/\\])/.test(path)) return fallback;

    return path;
}
