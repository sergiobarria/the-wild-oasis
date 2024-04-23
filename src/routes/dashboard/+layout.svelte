<script lang="ts">
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import AppHeader from '$lib/components/layout/app-header.svelte';
</script>

<div class="grid h-screen grid-cols-[14rem_1fr] grid-rows-[auto_1fr]">
	<AppHeader />
	<AppSidebar />
	<main class="bg-gray-50 px-8 py-6">
		<slot />
	</main>
</div>
