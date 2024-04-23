<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { getFlash, initFlash } from 'sveltekit-flash-message';
	import { toast } from 'svelte-sonner';
	import { fly } from 'svelte/transition';
	// import toast from 'svelte-french-toast';

	import * as Alert from '$lib/components/ui/alert';
	import CabinsTable from '$lib/components/cabins/cabins-table.svelte';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { TerminalIcon } from 'lucide-svelte';

	export let data: PageData;
	let showAlert = true;
	const flash = getFlash(page);
	// $: console.log('🚀 ~ flash:', $flash);

	onMount(() => {
		let timer = setTimeout(() => {
			showAlert = false;
		}, 5000);

		return () => {
			clearTimeout(timer);
		};
	});

	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				toast($flash.message);
				break;
			case 'error':
				toast.error($flash.message);
				break;
		}
		// console.log('🚀 ~ $flash:', $flash);
		// // if ($flash.type === 'success') {
		// console.log('🚀 ~ IS THIS CALLED');
		// toast('This is a success message.');
		// }
		// if ($flash.type === 'error') {
		// 	toast.error($flash.message);
		// }

		// console.log('🚀 ~ IS THIS CALLED????');
		// $flash = undefined;
	}
</script>

<svelte:head>
	<title>Cabins | HBS</title>
</svelte:head>

<h1 class="text-3xl font-bold mb-6">All Cabins</h1>

{#if $flash && showAlert}
	<div transition:fly={{ y: 20, duration: 300 }}>
		<Alert.Root>
			<TerminalIcon class="size-4" />
			<Alert.Title>Heads up!</Alert.Title>
			<Alert.Description>You can add components to your app using the cli.</Alert.Description>
		</Alert.Root>
	</div>
{/if}

<CabinsTable cabins={data.cabins} />
