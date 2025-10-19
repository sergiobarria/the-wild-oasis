<script lang="ts">
	import DashboardHeader from '$lib/components/dashboard/header.svelte';
	import DashboardSidebar from '$lib/components/dashboard/sidebar.svelte';
	import { SidebarProvider } from '$lib/components/ui/sidebar';
	import { APP_NAME } from '$lib/config/constants';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>Admin - {APP_NAME}</title>
</svelte:head>

<SidebarProvider open={data.defaultOpen}>
	<DashboardSidebar />

	<main class="flex h-screen w-full flex-col">
		<DashboardHeader />

		<div class="flex-grow overflow-y-auto px-5 py-4">
			{@render children()}
		</div>
	</main>
</SidebarProvider>
