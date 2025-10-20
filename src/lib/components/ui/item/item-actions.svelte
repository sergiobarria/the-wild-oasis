<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div data-slot="item-actions" class={cn('flex items-center gap-2', className)} {...restProps}>
	{@render children?.()}
</div>
