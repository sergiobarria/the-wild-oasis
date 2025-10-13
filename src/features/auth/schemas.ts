import { z } from 'zod'

export const SignUpSchema = z
    .object({
        email: z.string().nonempty('Please enter your email.').email('The email address is badly formatted.'),
        password: z
            .string()
            .nonempty('Please enter your password.')
            .min(8, 'Your password must have 8 characters or more.'),
        passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'The two passwords do not match.',
        path: ['passwordConfirmation'],
    })

export const SignInSchema = z.object({
    email: z.string().nonempty('Please enter your email.').email('The email address is badly formatted.'),
    password: z
        .string()
        .nonempty('Please enter your password.')
        .min(8, 'Your password must have 8 characters or more.'),
})
