import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import { Toaster } from './components/ui/toaster';
import globalStyles from '~/tailwind.css?url';
import favicon from '~/assets/favicon/favicon.ico';
import faviconManifest from '~/assets/favicon/site.webmanifest';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: globalStyles },
	{ rel: 'icon', type: 'image/x-icon', href: favicon },
	{ rel: 'manifest', href: faviconManifest },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
				<Toaster />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
