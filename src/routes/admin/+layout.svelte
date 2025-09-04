<script lang="ts">
	import AppSidebar from '$lib/components/admin/admin-sidebar.svelte';
	import SidebarToggle from '$lib/components/admin/sidebar-toggle.svelte';
	import ModeToggle from '$lib/components/shared/mode-toggle.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { APP_NAME } from '$lib/config/constants';

	let { children } = $props();
</script>

<svelte:head>
	<title>Admin | {APP_NAME}</title>
</svelte:head>

<Sidebar.Provider>
	<AppSidebar />

	<main class="w-full">
		<header class="mb-8 flex h-16 w-full items-center justify-between border-b px-5 py-2">
			<SidebarToggle />
			<ModeToggle />
		</header>
		<div class="w-full px-5">{@render children?.()}</div>
	</main>
</Sidebar.Provider>
