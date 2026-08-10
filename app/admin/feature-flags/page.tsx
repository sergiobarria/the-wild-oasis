import type { Metadata } from 'next';

import { AdminFeatureFlagsScreen } from '@/features/admin-feature-flags/admin-feature-flags-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Feature Flags -- Admin'),
};

export default function AdminFeatureFlagsPage() {
    return <AdminFeatureFlagsScreen />;
}
