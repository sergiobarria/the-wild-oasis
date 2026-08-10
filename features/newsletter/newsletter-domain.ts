import { z } from 'zod';

export const newsletterSchema = z.object({
    email: z.email('Enter a valid email address.'),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;

export const newsletterDefaultValues: NewsletterValues = {
    email: '',
};
