import React from 'react'

import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { CheckCircle2Icon, EyeIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { DEFAULT_DEBOUNCE_DELAY } from '@/config/constants'
import { authClient } from '@/lib/auth-client'

import { SignUpSchema } from '../schemas'

export function SignUpForm() {
    const [showPassword, setShowPassword] = React.useState<boolean>(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = React.useState<boolean>(false)
    const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error' | 'pending'>('idle')
    const [error, setError] = React.useState<string | null>(null)
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validators: {
            onChangeAsync: SignUpSchema,
            onChangeAsyncDebounceMs: DEFAULT_DEBOUNCE_DELAY,
        },
        onSubmit: async ({ value }) => {
            await authClient.signUp.email(
                {
                    email: value.email,
                    password: value.password,
                    name: '',
                    callbackURL: '/',
                },
                {
                    onRequest: () => {
                        setStatus('submitting')
                    },
                    onSuccess: () => {
                        setStatus('success')
                        form.reset()
                        toast.success('You have been signed up successfully!')
                        navigate({ to: '/' })
                    },
                    onError: (ctx) => {
                        setStatus('error')
                        setError(ctx.error.message)
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

                form.handleSubmit()
            }}
            className="space-y-6"
        >
            <FieldSet>
                <FieldGroup>
                    <form.Field
                        name="email"
                        children={(field) => (
                            <Field data-invalid={field.state.meta.errors.length > 0}>
                                <FieldLabel htmlFor="email">Tell us your email</FieldLabel>
                                <Input
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="email@example.com"
                                    aria-invalid={field.state.meta.errors.length > 0}
                                />
                                <FieldError errors={field.state.meta.errors} />
                            </Field>
                        )}
                    />

                    <form.Field
                        name="password"
                        children={(field) => (
                            <Field data-invalid={field.state.meta.errors.length > 0}>
                                <FieldLabel htmlFor="password">Add a secure password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        type={showPassword ? 'text' : 'password'}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={field.state.meta.errors.length > 0}
                                        placeholder="**********"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            aria-label="Show password"
                                            title="Show password"
                                            size="icon-xs"
                                            tabIndex={-1}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeIcon /> : <EyeIcon />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldError errors={field.state.meta.errors} />
                            </Field>
                        )}
                    />

                    <form.Field
                        name="passwordConfirmation"
                        children={(field) => (
                            <Field data-invalid={field.state.meta.errors.length > 0}>
                                <FieldLabel htmlFor="passwordConfirmation">Confirm your password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={field.state.meta.errors.length > 0}
                                        placeholder="**********"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            aria-label="Show password"
                                            title="Show password"
                                            size="icon-xs"
                                            tabIndex={-1}
                                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        >
                                            {showPasswordConfirm ? <EyeIcon /> : <EyeIcon />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldError errors={field.state.meta.errors} />
                            </Field>
                        )}
                    />
                </FieldGroup>
            </FieldSet>

            {error && (
                <Alert variant="destructive">
                    <CheckCircle2Icon />
                    <AlertTitle>Oops! Something went wrong</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' && <Spinner />}
                {status === 'submitting' ? 'Signing up...' : 'Sign Up'}
            </Button>
        </form>
    )
}
