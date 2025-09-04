<script lang="ts">
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import favicon16x16 from '$lib/assets/favicon-16x16.png';
	import favicon32x32 from '$lib/assets/favicon-32x32.png';
	import favicon from '$lib/assets/favicon.ico';
	import manifest from '$lib/assets/site.webmanifest';

	import { APP_DESCRIPTION, APP_NAME } from '$lib/config/constants';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>{APP_NAME}</title>

	<link href={favicon} rel="icon" />
	<link href={appleTouchIcon} rel="apple-touch-icon" sizes="180x180" />
	<link href={favicon32x32} rel="icon" sizes="32x32" type="image/png" />
	<link href={favicon16x16} rel="icon" sizes="16x16" type="image/png" />
	<link href={manifest} rel="manifest" />

	<meta name="description" content={APP_DESCRIPTION} />
</svelte:head>

<ModeWatcher defaultMode="system" />
{@render children?.()}
