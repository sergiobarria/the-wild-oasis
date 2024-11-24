<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import nProgress from 'nprogress';
	import 'nprogress/nprogress.css';

	import '../app.css';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	let { children } = $props();

	beforeNavigate(() => {
		nProgress.start();
	});

	afterNavigate(() => {
		nProgress.done();
	});
</script>

<svelte:head>
	<title>The Wild Oasis</title>
</svelte:head>

<ModeWatcher defaultMode="system" />
{@render children()}
