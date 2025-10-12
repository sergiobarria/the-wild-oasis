<script lang="ts">
	import { PanelLeftCloseIcon, PanelLeftOpenIcon } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';
	import { useSidebar } from '$lib/components/ui/sidebar';

	const sidebar = useSidebar();

	function toggleSidebar() {
		sidebar.setOpen(!sidebar.open);
	}
</script>

<Button
	variant="outline"
	size="icon"
	onclick={toggleSidebar}
	title="Toggle Sidebar"
	aria-label="Toggle Sidebar"
>
	{#if sidebar.open}
		<PanelLeftCloseIcon />
	{:else}
		<PanelLeftOpenIcon />
	{/if}
</Button>
