import { authClient } from '@/lib/auth-client';
import { joinName } from '@/lib/names';

import type { SignInValues, SignUpValues } from './auth-domain';

/**
 * Better Auth's built-in user schema has a single `name` field, not separate
 * first/last names -- combine them here (same `joinName` the profile-editing form uses)
 * rather than adding an additionalField before a feature actually needs them stored
 * separately.
 */
export async function signUpWithEmail(
    values: Omit<SignUpValues, 'confirmPassword' | 'acceptTerms'>,
) {
    return authClient.signUp.email({
        name: joinName(values.firstName, values.lastName),
        email: values.email,
        password: values.password,
    });
}

export async function signInWithEmail(values: SignInValues) {
    return authClient.signIn.email(values);
}
