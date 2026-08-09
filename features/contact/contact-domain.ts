import { z } from 'zod';

const MESSAGE_MAX_LENGTH = 5000;

export const contactSchema = z.object({
    name: z.string().trim().min(1, 'Enter your name.'),
    email: z.email('Enter a valid email address.'),
    phone: z.string().trim().optional(),
    subject: z.string().trim().min(1, 'Enter a subject.'),
    message: z
        .string()
        .trim()
        .min(1, 'Enter a message.')
        .max(MESSAGE_MAX_LENGTH, `Keep your message under ${MESSAGE_MAX_LENGTH} characters.`),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const contactDefaultValues: ContactValues = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
};
