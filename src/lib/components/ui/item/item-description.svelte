<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p
	data-slot="item-description"
	class={cn(
		'line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground',
		'[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
