<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	data-slot="item-title"
	class={cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium', className)}
	{...restProps}
>
	{@render children?.()}
</div>
