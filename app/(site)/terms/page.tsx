import type { Metadata } from 'next';
import Link from 'next/link';

import { ContentPageShell } from '@/components/content-page-shell';
import { APP_ROUTES } from '@/lib/routes';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Terms'),
    description: 'The terms that govern booking and staying with The Wild Oasis.',
};

const LAST_UPDATED = 'August 2026';

const SECTIONS = [
    {
        heading: 'Booking terms',
        body: 'A reservation is confirmed once you complete checkout. You must be at least 18 years old and provide accurate guest and contact information to book.',
    },
    {
        heading: 'Payment terms',
        body: 'Where real payments are enabled, charges are processed by Stripe at the time of booking. In demo mode, reservations are confirmed without any payment being collected.',
    },
    {
        heading: 'Cancellation',
        body: "Self-service cancellation is available up until the cancellation window shown on your reservation. After that window closes, cancelling a paid reservation requires contacting us directly, and refunds aren't guaranteed.",
    },
    {
        heading: 'Guest responsibilities',
        body: 'Guests are responsible for leaving the cabin in the condition they found it, respecting any occupancy limits and house rules listed on the cabin page, and reporting damage promptly.',
    },
    {
        heading: 'Property rules',
        body: 'Each cabin may have its own rules (quiet hours, pet policy, smoking policy) shown on its listing page. Rules specific to a property take precedence over these general terms.',
    },
    {
        heading: 'Liability',
        body: 'Cabins are provided as-is. We are not liable for injury, loss, or damage arising from your stay except where required by law. Guests use cabin amenities (fireplaces, hot tubs, outdoor areas) at their own risk.',
    },
    {
        heading: 'Account usage',
        body: 'Your account is for your personal use. Keep your login credentials confidential, and let us know right away if you suspect unauthorized access.',
    },
] as const;

export default function TermsPage() {
    return (
        <ContentPageShell
            title='Terms of Service'
            description={`Last updated ${LAST_UPDATED}. This is a demonstration project -- these terms are written to be realistic but have not been legally reviewed and do not constitute a binding agreement.`}
        >
            <div className='space-y-8'>
                {SECTIONS.map(({ heading, body }) => (
                    <section key={heading} className='space-y-2'>
                        <h2 className='font-heading text-lg font-medium'>{heading}</h2>
                        <p className='text-sm text-muted-foreground'>{body}</p>
                    </section>
                ))}

                <section className='space-y-2'>
                    <h2 className='font-heading text-lg font-medium'>Privacy</h2>
                    <p className='text-sm text-muted-foreground'>
                        How we handle your data is covered separately in our{' '}
                        <Link
                            href={APP_ROUTES.PRIVACY}
                            className='underline underline-offset-4 hover:text-foreground'
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </section>

                <section className='space-y-2'>
                    <h2 className='font-heading text-lg font-medium'>Contact</h2>
                    <p className='text-sm text-muted-foreground'>
                        Questions about these terms? Reach out through our{' '}
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
