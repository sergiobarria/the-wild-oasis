import { authClient } from '@/lib/auth-client';
import { joinName } from '@/lib/names';
import { APP_ROUTES } from '@/lib/routes';

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

export async function requestPasswordReset(email: string) {
    return authClient.requestPasswordReset({
        email,
        redirectTo: APP_ROUTES.RESET_PASSWORD,
    });
}

export async function resetPassword(newPassword: string, token: string) {
    return authClient.resetPassword({ newPassword, token });
}
