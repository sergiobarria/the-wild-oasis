import { Suspense } from 'react';

import type { Metadata } from 'next';

import { SignInScreen } from '@/features/auth/sign-in-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Sign In'),
};

export default function SignInPage() {
    return (
        <Suspense>
            <SignInScreen />
        </Suspense>
    );
}
