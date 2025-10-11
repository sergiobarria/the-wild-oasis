import React from 'react'

import { useForm } from '@tanstack/react-form'

import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'

const ContactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Please enter a valid email address'),
    phone: z.string(),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
})

export function ContactForm() {
    const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        },
        validators: {
            onChangeAsync: ContactFormSchema,
            onChangeAsyncDebounceMs: 500,
        },
        onSubmit: async ({ value }) => {
            console.log(value)
            setState('loading')
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                void form.handleSubmit()
            }}
            className="mx-auto mt-12 max-w-4xl"
        >
            <FieldSet className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <form.Field
                    name="name"
                    children={(field) => (
                        <Field data-invalid={field.state.meta.errors.length > 0} className="md:col-span-1">
                            <FieldLabel htmlFor="name">Tell us your name*</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                aria-invalid={field.state.meta.errors.length > 0}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors?.map((error) => (
                                <FieldError key={error?.message}>{error?.message}</FieldError>
                            ))}
                        </Field>
                    )}
                />

                <form.Field
                    name="email"
                    children={(field) => (
                        <Field data-invalid={field.state.meta.errors.length > 0} className="md:col-span-1">
                            <FieldLabel htmlFor="email">Tell us your email address*</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="iamawesome@email.com"
                                aria-invalid={field.state.meta.errors.length > 0}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors?.map((error) => (
                                <FieldError key={error?.message}>{error?.message}</FieldError>
                            ))}
                        </Field>
                    )}
                />

                <form.Field
                    name="subject"
                    children={(field) => (
                        <Field data-invalid={field.state.meta.errors.length > 0} className="md:col-span-1">
                            <FieldLabel htmlFor="subject">Subject*</FieldLabel>
                            <Input
                                id="subject"
                                type="text"
                                placeholder="Subject"
                                aria-invalid={field.state.meta.errors.length > 0}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors?.map((error) => (
                                <FieldError key={error?.message}>{error?.message}</FieldError>
                            ))}
                        </Field>
                    )}
                />

                <form.Field
                    name="phone"
                    children={(field) => (
                        <Field data-invalid={field.state.meta.errors.length > 0} className="md:col-span-1">
                            <FieldLabel htmlFor="phone">Tell us your phone number</FieldLabel>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="123-456-7890"
                                aria-invalid={field.state.meta.errors.length > 0}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors?.map((error) => (
                                <FieldError key={error?.message}>{error?.message}</FieldError>
                            ))}
                        </Field>
                    )}
                />

                <form.Field
                    name="message"
                    children={(field) => (
                        <Field data-invalid={field.state.meta.errors.length > 0} className="md:col-span-2">
                            <FieldLabel htmlFor="message">Message*</FieldLabel>
                            <Textarea
                                id="message"
                                placeholder="Message"
                                rows={5}
                                aria-invalid={field.state.meta.errors.length > 0}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors?.map((error) => (
                                <FieldError key={error?.message}>{error?.message}</FieldError>
                            ))}
                        </Field>
                    )}
                />

                {state === 'error' && (
                    <p className="text-destructive text-sm">Something went wrong. Please try again.</p>
                )}
            </FieldSet>

            <Button type="submit" className="mt-6" disabled={state === 'loading'} onClick={() => form.handleSubmit()}>
                {state === 'loading' && <Spinner />}
                {state === 'loading' ? 'Sending Message...' : 'Send Message'}
            </Button>
        </form>
    )
}
