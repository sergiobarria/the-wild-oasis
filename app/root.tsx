import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useFetchers,
	useLoaderData,
	useNavigation,
} from '@remix-run/react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect, useMemo } from 'react'
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes'

import { themeSessionResolver } from './lib/theme-session.server'
import { cn } from './lib/utils'
import styles from './tailwind.css?url'

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
	{
		rel: 'apple-touch-icon',
		sizes: '180x180',
		href: '/apple-touch-icon.png',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '32x32',
		href: '/favicon-32x32.png',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '16x16',
		href: '/favicon-16x16.png',
	},
	{ rel: 'manifest', href: '/site.webmanifest' },
	{ rel: 'stylesheet', href: styles },
	// { rel: 'stylesheet', href: nProgressStyles }, // NProgress styles
]

export async function loader({ request }: LoaderFunctionArgs) {
	const { getTheme } = await themeSessionResolver(request)

	return {
		theme: getTheme(),
	}
}

export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	const transition = useNavigation()
	const fetchers = useFetchers()

	const state = useMemo<'idle' | 'loading'>(
		function getGlobalState() {
			const states = [transition.state, ...fetchers.map((fetcher) => fetcher.state)]
			if (states.every((state) => state === 'idle')) return 'idle'
			return 'loading'
		},
		[transition.state, fetchers],
	)

	useEffect(() => {
		if (state === 'loading') NProgress.start()

		if (state === 'idle') NProgress.done()
	}, [transition.state, state])

	return (
		<ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
			<App />
		</ThemeProvider>
	)
}

export function App() {
	const data = useLoaderData<typeof loader>()
	const [theme] = useTheme()

	return (
		<html lang="en" className={cn(theme)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
			</head>
			<body className="antialiased">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}
