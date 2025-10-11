import React from 'react'

import { useForm } from '@tanstack/react-form'

import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

const NewsletterFormSchema = z.object({
    email: z.email(),
})

export function NewsletterForm() {
    const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const form = useForm({
        defaultValues: {
            email: '',
        },
        validators: {
            onChangeAsync: NewsletterFormSchema,
            onChangeAsyncDebounceMs: 500,
        },
        onSubmit: async ({ value }) => {
            console.log('🚀 ~ NewsletterForm ~ value:', value)
            setState('loading')

            // TODO: Implement newsletter subscription
        },
    })

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    form.handleSubmit()
                }}
                className="mt-6 flex flex-col gap-1 sm:flex-row"
            >
                <form.Field
                    name="email"
                    children={(field) => (
                        <Field data-invalid={field.state.meta.errors.length > 0} className="w-full">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                aria-invalid={field.state.meta.errors.length > 0}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors?.map((error) => (
                                <FieldError key={error?.message}>{error?.message}</FieldError>
                            ))}
                        </Field>
                    )}
                />

                <Button type="submit" disabled={state === 'loading'}>
                    {state === 'loading' && <Spinner />}
                    {state === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </Button>
            </form>

            <div className="mt-4 mb-4 rounded-lg px-4 py-2 text-sm text-emerald-500">
                {state === 'success' && 'You have successfully subscribed to our newsletter!'}
            </div>
        </>
    )
}
