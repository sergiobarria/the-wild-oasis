<script lang="ts">
	import AppSidebar from '$lib/components/site/app-sidebar.svelte';
	import Header from '$lib/components/site/header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full px-4 py-2">
		<Header />
		{@render children?.()}
	</main>
</Sidebar.Provider>
