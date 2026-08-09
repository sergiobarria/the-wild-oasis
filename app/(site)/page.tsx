import type { Metadata } from 'next';

import { HomeScreen } from '@/features/home/home-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = { title: pageTitle() };

export default function Home() {
    return <HomeScreen />;
}
