import type { Metadata } from 'next';

import { ProfileForm } from '@/features/guest-area/components/profile-form';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Profile'),
};

export default function GuestAreaProfilePage() {
    return (
        <div className='space-y-6'>
            <h1 className='font-heading text-2xl font-medium'>Profile</h1>
            <ProfileForm />
        </div>
    );
}
