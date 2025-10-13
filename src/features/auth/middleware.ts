import { createMiddleware } from '@tanstack/react-start'

import { getCurrentsessionFn } from './api'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
    const authSession = await getCurrentsessionFn()
    if (!authSession) throw new Error('Unauthorized')

    return next({
        context: {
            session: authSession.session,
            user: authSession.user,
        },
    })
})
