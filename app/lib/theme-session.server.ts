import { createCookieSessionStorage } from '@remix-run/node'
import { createThemeSessionResolver } from 'remix-themes'

import { env } from '~/app-config/env'

const isProduction = env.NODE_ENV === 'production'

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'theme',
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secrets: [env.APP_SECRET],
		// TODO: Set domain and secure only if in production
		...(isProduction ? { domain: 'your-production-domain.com', secure: true } : {}),
	},
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
