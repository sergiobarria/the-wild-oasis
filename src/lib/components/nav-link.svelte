<script lang="ts">
	import { page } from '$app/stores';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import { cn } from '$lib/utils';

	export let label: string;
	export let href: string;
	export let icon: any;
	let isOpen = false;

	$: isOpen = $page.url.pathname.includes(href);
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild>
		<a
			{href}
			class={cn('flex items-center gap-3 rounded-lg p-2', {
				'bg-primary text-white': $page.url.pathname.includes(href),
				'text-muted-foreground bg-transparent hover:bg-gray-200':
					!$page.url.pathname.includes(href)
			})}
		>
			<div><svelte:component this={icon} class="size-4" /></div>
			<span class={cn('text-xs duration-300', !isOpen && 'hidden')}>{label}</span>
		</a>
	</Tooltip.Trigger>

	<Tooltip.Content side="right">
		<p class="capitalize">{label}</p>
	</Tooltip.Content>
</Tooltip.Root>
