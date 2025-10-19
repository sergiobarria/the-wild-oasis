<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import { Separator } from '$lib/components/ui/separator/index.js';
	import { cn } from '$lib/utils.js';

	let { class: className, ...restProps }: ComponentProps<typeof Separator> = $props();
</script>

<Separator
	data-slot="item-separator"
	orientation="horizontal"
	class={cn('my-0', className)}
	{...restProps}
/>
