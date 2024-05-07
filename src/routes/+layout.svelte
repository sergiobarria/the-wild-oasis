<script>
	import { page } from '$app/stores';
	import { getFlash } from 'sveltekit-flash-message';
	import { ModeWatcher } from 'mode-watcher';
	import toast, { Toaster } from 'svelte-french-toast';

	import '../app.css';

	const flash = getFlash(page);

	$: if ($flash) {
		console.log('🚀 ~ $flash:', $flash);
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
</script>

<svelte:head>
	<title>The Wild Oasis</title>
</svelte:head>

<slot />
<Toaster position="bottom-right" toastOptions={{ className: 'text-xs' }} />
<ModeWatcher defaultMode="light" />
