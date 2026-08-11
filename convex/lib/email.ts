import { render } from '@react-email/render';
import { v } from 'convex/values';
import { Resend } from 'resend';

import { ResetPasswordEmail } from '../../emails/reset-password-email';
import { env, internalAction } from '../_generated/server';

export const sendResetPasswordEmail = internalAction({
    args: { to: v.string(), name: v.string(), resetUrl: v.string() },
    returns: v.null(),
    handler: async (_ctx, args) => {
        const resend = new Resend(env.RESEND_API_KEY);
        const html = await render(ResetPasswordEmail({ name: args.name, resetUrl: args.resetUrl }));

        const { error } = await resend.emails.send({
            from: env.RESEND_FROM_EMAIL,
            to: args.to,
            subject: 'Reset your Wild Oasis password',
            html,
        });

        // Resend's SDK reports failures in `error` rather than throwing -- surface it as a
        // real error so a bad key/address doesn't silently report success to Better Auth.
        if (error) {
            throw new Error(`Failed to send reset-password email: ${error.message}`);
        }

        return null;
    },
});
