import type { Metadata } from 'next';
import Link from 'next/link';

import { ContentPageShell } from '@/components/content-page-shell';
import { APP_ROUTES } from '@/lib/routes';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Privacy Policy'),
    description: 'How The Wild Oasis collects, uses, and protects your information.',
};

const LAST_UPDATED = 'August 2026';

const SECTIONS = [
    {
        heading: 'Information we collect',
        body: 'We collect the information you give us directly -- your name, email, and any details you submit through the booking or contact forms -- along with basic usage data (pages visited, device type) collected automatically to keep the site working correctly.',
    },
    {
        heading: 'Account information',
        body: 'Creating an account stores your name, email, and password (handled securely by our authentication provider, never stored in plain text). You can update this information from your account settings at any time.',
    },
    {
        heading: 'Reservation information',
        body: 'Booking a cabin records your stay dates, guest count, and the cabin selected, associated with your account so you can view and manage your reservations.',
    },
    {
        heading: 'Payment processing',
        body: 'Where real payments are enabled, card details are collected and processed entirely by Stripe, our external payment processor -- we never see or store your full card number. Stripe maintains its own privacy and security practices, described at stripe.com/privacy.',
    },
    {
        heading: 'Cookies',
        body: 'We use a small number of cookies required for authentication and session management. We do not use third-party advertising or tracking cookies.',
    },
    {
        heading: 'Third-party services',
        body: 'We rely on a small set of infrastructure providers to run this application -- a hosting/database provider, an authentication provider, and (where enabled) Stripe for payments. Each processes data only as needed to provide their service to us.',
    },
    {
        heading: 'Data retention',
        body: "We keep account and reservation data for as long as your account is active. If you'd like your data deleted, contact us and we'll remove what we can, subject to any records we're required to keep.",
    },
] as const;

export default function PrivacyPage() {
    return (
        <ContentPageShell
            title='Privacy Policy'
            description={`Last updated ${LAST_UPDATED}. This is a demonstration project -- this policy describes our actual practices but has not been reviewed by legal counsel and makes no certification or compliance claims.`}
        >
            <div className='space-y-8'>
                {SECTIONS.map(({ heading, body }) => (
                    <section key={heading} className='space-y-2'>
                        <h2 className='font-heading text-lg font-medium'>{heading}</h2>
                        <p className='text-sm text-muted-foreground'>{body}</p>
                    </section>
                ))}

                <section className='space-y-2'>
                    <h2 className='font-heading text-lg font-medium'>Contact information</h2>
                    <p className='text-sm text-muted-foreground'>
                        Questions about this policy or your data? Reach out through our{' '}
                        <Link
                            href={APP_ROUTES.CONTACT}
                            className='underline underline-offset-4 hover:text-foreground'
                        >
                            contact page
                        </Link>
                        .
                    </p>
                </section>
            </div>
        </ContentPageShell>
    );
}
