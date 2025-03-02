<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import nProgress from 'nprogress';

	import 'nprogress/nprogress.css';
	import '../app.css';

	let { children } = $props();

	nProgress.configure({
		showSpinner: false,
		minimum: 0.1,
		easing: 'ease',
		speed: 500
	});

	beforeNavigate(() => {
		nProgress.start();
	});

	afterNavigate(() => {
		nProgress.done();
	});
</script>

<svelte:head>
	<title>The Wild Oasis</title>
	<meta name="description" content="The Wild Oasis is a place for all things nature." />
</svelte:head>

{@render children()}
