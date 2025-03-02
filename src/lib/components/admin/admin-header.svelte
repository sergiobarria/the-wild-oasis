<script lang="ts">
	import { PanelRightCloseIcon, PanelRightOpenIcon } from 'lucide-svelte';

	import { useSidebarContext } from '$lib/context/sidebar-context.svelte';

	const sidebar = useSidebarContext();
</script>

<header class="flex h-20 items-center justify-between p-4 transition-all duration-300 ease-in-out">
	<!-- Sidebar Toggle Button -->
	<button class="btn btn-square btn-ghost hidden md:flex" onclick={sidebar.toggle}>
		{#if sidebar.open}
			<PanelRightOpenIcon size={20} />
		{:else}
			<PanelRightCloseIcon size={20} />
		{/if}
	</button>

	<div class="avatar">
		<div class="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
			<img src="https://github.com/sergiobarria.png" alt="" />
		</div>
	</div>
</header>
