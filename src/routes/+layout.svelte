<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import AppHeader from '$lib/components/app-header.svelte';

	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
</script>

<div class="grid h-screen grid-cols-[14rem_1fr] grid-rows-[auto_1fr]">
	<AppHeader />
	<AppSidebar />
	<main class="bg-gray-50 px-8 py-6">
		<slot />
	</main>
	<ModeWatcher defaultMode="light" />
	<Toaster />
</div>
