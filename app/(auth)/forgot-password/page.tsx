import type { Metadata } from 'next';

import { ForgotPasswordScreen } from '@/features/auth/forgot-password-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Forgot Password'),
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordScreen />;
}
