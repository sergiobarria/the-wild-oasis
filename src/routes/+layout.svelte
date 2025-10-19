<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import nprogress from 'nprogress';
	import 'nprogress/nprogress.css';

	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner';
	import { APP_CREATOR, APP_DESCRIPTION, APP_KEYWORDS, APP_NAME } from '$lib/config/app';

	import '../app.css';

	nprogress.configure({
		showSpinner: false
	});

	beforeNavigate(() => {
		nprogress.start();
	});

	afterNavigate(() => {
		nprogress.done();
	});

	let { children } = $props();
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta charset="utf-8" />
	<meta name="description" content={APP_DESCRIPTION} />
	<meta name="keywords" content={APP_KEYWORDS} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:title" content={APP_NAME} />
	<meta property="og:description" content={APP_DESCRIPTION} />
	<meta property="og:image" content="URL_TO_DEFAULT_OG_IMAGE_HERE" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={page.url.href} />
	<meta name="twitter:title" content={APP_NAME} />
	<meta name="twitter:description" content={APP_DESCRIPTION} />
	<meta name="twitter:image" content="URL_TO_DEFAULT_OG_IMAGE_HERE" />
	<meta name="twitter:creator" content={APP_CREATOR} />
	<meta name="twitter:site" content={APP_CREATOR} />

	<link rel="canonical" href={page.url.href} />

	<!-- Favicon & PWA Manifest -->
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap"
		rel="stylesheet"
	/>

	<title>{APP_NAME}</title>
</svelte:head>

<ModeWatcher defaultMode="system" />
<Toaster />
{@render children?.()}
