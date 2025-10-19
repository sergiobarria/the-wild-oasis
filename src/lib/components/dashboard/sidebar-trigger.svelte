<script lang="ts">
	import { PanelRightClose, PanelRightOpen } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';
	import { useSidebar } from '$lib/components/ui/sidebar';

	const sidebar = useSidebar();
</script>

<Button
	variant="outline"
	size="icon"
	onclick={sidebar.toggle}
	title="Toggle Sidebar"
	aria-label="Toggle Sidebar"
>
	{#if sidebar.open}
		<PanelRightOpen />
	{:else}
		<PanelRightClose />
	{/if}
</Button>
