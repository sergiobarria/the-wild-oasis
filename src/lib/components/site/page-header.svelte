<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		actions?: Snippet;
	}
	let { title, actions }: Props = $props();
</script>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-bold">{title}</h1>
	{#if actions}
		{@render actions()}
	{/if}
</div>
