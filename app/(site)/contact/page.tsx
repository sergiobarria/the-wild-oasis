import type { Metadata } from 'next';

import { ContentPageShell } from '@/components/content-page-shell';
import { ContactScreen } from '@/features/contact/contact-screen';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Contact'),
    description: 'Get in touch with The Wild Oasis -- questions, feedback, or booking help.',
};

export default function ContactPage() {
    return (
        <ContentPageShell
            title='Get in touch'
            description="Questions about a stay, feedback, or anything else -- we'd love to hear from you."
        >
            <ContactScreen />
        </ContentPageShell>
    );
}
