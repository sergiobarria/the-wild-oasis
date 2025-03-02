<script lang="ts">
	import AdminHeader from '$lib/components/admin/admin-header.svelte';
	import AdminSidebar from '$lib/components/admin/admin-sidebar.svelte';
	import { setSidebarContext } from '$lib/context/sidebar-context.svelte';

	let { children } = $props();

	setSidebarContext(true); // Sidebar is open by default
</script>

<div class="flex h-svh">
	<AdminSidebar />

	<div class="flex w-full flex-col">
		<AdminHeader />
		<main class="h-full p-4">{@render children()}</main>
	</div>
</div>
