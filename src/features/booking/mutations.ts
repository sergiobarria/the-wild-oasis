import { useMutation } from '@tanstack/react-query'

import { toast } from 'sonner'

import { createCheckoutSessionFn } from './api'

export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: createCheckoutSessionFn,
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url
            }
        },
        onError: (error) => {
            console.error('Failed to create checkout session', error)
            toast.error('Failed to create checkout session. Please try again.')
        },
    })
}
