import type { ReactNode } from 'react';

import { Body, Container, Head, Hr, Html, Preview, Tailwind, Text } from 'react-email';

import { emailTailwindConfig } from '../tailwind-config';

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
    return (
        <Html lang='en'>
            <Tailwind config={emailTailwindConfig}>
                <Head />
                <Preview>{preview}</Preview>
                <Body className='bg-background py-10 font-sans'>
                    <Container className='mx-auto max-w-[480px] rounded-lg border border-border bg-card p-8'>
                        <Text className='m-0 mb-6 text-lg font-semibold text-foreground'>
                            The Wild Oasis
                        </Text>
                        {children}
                        <Hr className='my-6 border-border' />
                        <Text className='m-0 text-xs text-muted-foreground'>The Wild Oasis</Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
