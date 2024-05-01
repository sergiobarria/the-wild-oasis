<script lang="ts">
	import { page } from '$app/stores';

	import { ModeWatcher } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	import '@fontsource/poppins/300.css';
	import '@fontsource/poppins/400.css';
	import '@fontsource/poppins/500.css';
	import '@fontsource/poppins/600.css';
	import '@fontsource/poppins/700.css';

	import { Toaster } from '$lib/components/ui/sonner';

	import '../app.css';

	let { children } = $props();
	const flash = getFlash(page);

	$effect(() => {
		if ($flash) {
			switch ($flash.type) {
				case 'success': {
					toast.success($flash.message);
					break;
				}
				case 'error': {
					toast.error($flash.message);
					break;
				}
			}
		}
	});
</script>

<svelte:head>
	<title>Home | The Wild Oasis</title>
</svelte:head>

{@render children()}
<ModeWatcher defaultMode="light" />
<Toaster />
