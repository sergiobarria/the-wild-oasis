<script lang="ts">
	import DashboardHeader from '$lib/components/dashboard/header.svelte';
	import DashboardSidebar from '$lib/components/dashboard/sidebar.svelte';
	import { SidebarProvider } from '$lib/components/ui/sidebar';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let open = $state(data.open);
</script>

<SidebarProvider bind:open>
	<DashboardSidebar />

	<main class="flex h-screen w-full flex-col">
		<DashboardHeader />

		<div class="flex-grow overflow-y-auto px-5 py-4">
			{@render children()}
		</div>
	</main>
</SidebarProvider>
