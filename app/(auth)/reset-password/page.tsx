import type { Metadata } from 'next';

import { ResetPasswordScreen } from '@/features/auth/reset-password-screen';
import { firstSearchParam } from '@/lib/search-params';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Reset Password'),
};

export default async function ResetPasswordPage({ searchParams }: PageProps<'/reset-password'>) {
    const params = await searchParams;
    const token = firstSearchParam(params.token);

    return <ResetPasswordScreen token={token} />;
}
