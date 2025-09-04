<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { SidebarCloseIcon, SidebarOpenIcon } from '@lucide/svelte';

	const sidebar = useSidebar();
</script>

<Button variant="ghost" size="icon" class="cursor-pointer" onclick={sidebar.toggle}>
	{#if sidebar.open}
		<SidebarCloseIcon class="size-5" />
	{:else}
		<SidebarOpenIcon class="size-5" />
	{/if}
</Button>
