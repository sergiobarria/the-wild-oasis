<script lang="ts">
	import ThemeToggle from '$lib/components/shared/theme-toggle.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
</script>

<header class="flex items-center justify-between border-b px-5 py-3">
	<div class="flex h-5 items-center gap-4">
		<Sidebar.Trigger />
	</div>

	<ThemeToggle />
</header>
