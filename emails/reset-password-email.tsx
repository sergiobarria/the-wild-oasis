import { Heading, Text } from 'react-email';

import { EmailButton } from './components/email-button';
import { EmailLayout } from './components/email-layout';

interface ResetPasswordEmailProps {
    name: string;
    resetUrl: string;
}

export default function ResetPasswordEmail({ name, resetUrl }: ResetPasswordEmailProps) {
    return (
        <EmailLayout preview='Reset your Wild Oasis password'>
            <Heading as='h2' className='m-0 mb-4 text-xl font-semibold text-foreground'>
                Reset your password
            </Heading>
            <Text className='text-sm text-foreground'>Hi {name},</Text>
            <Text className='text-sm text-foreground'>
                We received a request to reset your Wild Oasis password. This link expires in 1 hour
                and can only be used once.
            </Text>
            <EmailButton href={resetUrl}>Reset password</EmailButton>
            <Text className='mt-6 text-xs text-muted-foreground'>
                Didn&apos;t request this? You can safely ignore this email -- your password will not
                change.
            </Text>
        </EmailLayout>
    );
}

ResetPasswordEmail.PreviewProps = {
    name: 'Jordan',
    resetUrl: 'http://localhost:3000/reset-password?token=preview-token',
} satisfies ResetPasswordEmailProps;

export { ResetPasswordEmail };
