import type { Metadata } from 'next';

import { OverviewScreen } from '@/features/guest-area/overview-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Overview'),
};

export default function GuestAreaOverviewPage() {
    return <OverviewScreen />;
}
