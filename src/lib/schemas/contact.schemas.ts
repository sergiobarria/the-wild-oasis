import z from 'zod';

export const ContactFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.email('Please enter a valid email address'),
	phone: z.string(),
	subject: z.string().min(1, 'Subject is required'),
	message: z.string().min(10, 'Message must be at least 10 characters')
});
