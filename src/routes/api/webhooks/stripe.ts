import { createFileRoute } from '@tanstack/react-router'

import { handleStripeWebhookFn } from '@/features/booking/webhooks'

export const Route = createFileRoute('/api/webhooks/stripe')({
    server: {
        handlers: {
            POST: async () => {
                try {
                    const result = await handleStripeWebhookFn()

                    return new Response(JSON.stringify(result), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                } catch (err: unknown) {
                    console.error('Stripe webhook error: ', err)

                    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                }
            },
        },
    },
})
