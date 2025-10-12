<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import appleTouchIcon from '$lib/assets/favicon/apple-touch-icon.png';
	import favicon16 from '$lib/assets/favicon/favicon-16x16.png';
	import favicon32 from '$lib/assets/favicon/favicon-32x32.png';
	import favicon from '$lib/assets/favicon/favicon.ico';
	import siteWebmanifest from '$lib/assets/favicon/site.webmanifest';
	import { Toaster } from '$lib/components/ui/sonner';
	import { APP_DESCRIPTION, APP_NAME, APP_URL } from '$lib/config/constants';

	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Favicon -->
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
	<link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
	<link rel="manifest" href={siteWebmanifest} />

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap"
		rel="stylesheet"
	/>

	<title>{APP_NAME}</title>

	<!-- Meta -->
	<meta name="description" content={APP_DESCRIPTION} />

	<!-- Open Graph -->
	<meta property="og:title" content={APP_NAME} />
	<meta property="og:description" content={APP_DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={APP_URL} />
	<meta property="og:image" content={APP_URL + '/logo.png'} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={APP_NAME} />
	<meta name="twitter:description" content={APP_DESCRIPTION} />
	<meta name="twitter:image" content={APP_URL + '/logo.png'} />
</svelte:head>

<ModeWatcher defaultMode="system" />
<Toaster />
{@render children?.()}
