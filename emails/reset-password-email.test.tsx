import { render } from 'react-email';
import { describe, expect, it } from 'vitest';

import { ResetPasswordEmail } from './reset-password-email';

describe('ResetPasswordEmail', () => {
    it('renders the recipient name and reset link into the HTML output', async () => {
        const html = await render(
            <ResetPasswordEmail name='Jordan' resetUrl='https://example.com/reset?token=abc' />,
        );

        expect(html).toContain('Jordan');
        expect(html).toContain('https://example.com/reset?token=abc');
        expect(html).toContain('Reset your password');
    });

    it('renders a plain-text fallback with no markup', async () => {
        const text = await render(
            <ResetPasswordEmail name='Jordan' resetUrl='https://example.com/reset?token=abc' />,
            { plainText: true },
        );

        expect(text).toContain('Jordan');
        expect(text).not.toContain('<html');
    });
});
