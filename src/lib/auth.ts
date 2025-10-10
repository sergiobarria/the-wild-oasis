import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { reactStartCookies } from 'better-auth/react-start'

import { db } from '@/database'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'sqlite',
        usePlural: true,
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true, // TODO: change to false
    },
    socialProviders: {
        // TODO: Add GitHub and Google providers
    },
    plugins: [reactStartCookies()],
})
