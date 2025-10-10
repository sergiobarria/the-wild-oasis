import { createAuthClient } from 'better-auth/svelte'

import { env } from '@/config/client-env'

export const authClient = createAuthClient({
    baseURL: env.VITE_APP_URL,
})
