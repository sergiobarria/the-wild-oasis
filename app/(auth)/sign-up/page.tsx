import type { Metadata } from 'next';

import { SignUpScreen } from '@/features/auth/sign-up-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Sign Up'),
};

export default function SignUpPage() {
    return <SignUpScreen />;
}
