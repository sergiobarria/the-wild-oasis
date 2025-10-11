import React from 'react'

import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { DEFAULT_REDIRECT_AFTER_LOGIN } from '@/config/constants'
import { authClient } from '@/lib/auth-client'

const SignInSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export function SignInForm() {
    const [showPassword, setShowPassword] = React.useState<boolean>(false)
    const [state, setState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onChangeAsync: SignInSchema,
            onChangeAsyncDebounceMs: 500,
        },
        onSubmit: async ({ value }) => {
            await authClient.signIn.email(
                { email: value.email, password: value.password },
                {
                    onRequest: () => {
                        setState('loading')
                    },
                    onSuccess: () => {
                        setState('success')
                        toast.success('You have successfully logged in')
                        navigate({ to: DEFAULT_REDIRECT_AFTER_LOGIN })
                    },
                    onError: (ctx) => {
                        //   TODO: Improve error handling
                        console.error(ctx.error)
                        setState('error')
                        toast.error('Something went wrong')
                    },
                },
            )
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                void form.handleSubmit()
            }}
            className="space-y-6"
        >
            <FieldSet>
                <FieldGroup className="gap-3">
                    <form.Field
                        name="email"
                        children={(field) => (
                            <Field data-invalid={field.state.meta.errors.length > 0}>
                                <FieldLabel htmlFor="email">Tell us your email address</FieldLabel>
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
                        name="password"
                        children={(field) => (
                            <Field data-invalid={field.state.meta.errors.length > 0}>
                                <FieldLabel htmlFor="password">Choose a password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={field.state.meta.errors.length > 0}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            aria-label="Show password"
                                            title="Show password"
                                            size="icon-xs"
                                            tabIndex={-1}
                                            onClick={() => {
                                                setShowPassword((prev) => !prev)
                                            }}
                                        >
                                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                {field.state.meta.errors?.map((error) => (
                                    <FieldError key={error?.message}>{error?.message}</FieldError>
                                ))}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </FieldSet>

            {state === 'error' && <p className="text-destructive text-sm">Something went wrong. Please try again.</p>}

            <Button type="submit" className="w-full" disabled={state === 'loading'} onClick={() => form.handleSubmit()}>
                {state === 'loading' && <Spinner />}
                {state === 'loading' ? 'Signing In...' : 'Sign In'}
            </Button>
        </form>
    )
}
