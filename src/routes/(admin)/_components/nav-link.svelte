<script lang="ts">
	import { page } from '$app/stores';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	type Props = {
		name: string;
		href: string;
		icon: any;
		exact: boolean;
		isOpen: boolean;
	};

	let { name, href, icon, exact, isOpen }: Props = $props();

	function isActiveLink(href: string, isExact: boolean) {
		if (isExact) return $page.url.pathname === href;

		return $page.url.pathname === href || $page.url.pathname.startsWith(href);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<Button
			{href}
			builders={[builder]}
			variant="ghost"
			class={cn('flex justify-start rounded-lg p-0 text-muted-foreground transition-colors duration-300', {
				'bg-primary text-background hover:bg-primary hover:text-primary-foreground': isActiveLink(href, exact),
				'hover:bg-primary hover:text-primary-foreground': !isActiveLink(href, exact),
				'gap-2 px-2.5 py-2': isOpen,
				'size-9 items-center justify-center': !isOpen
			})}
		>
			<svelte:component this={icon} class="size-4" />
			{#if isOpen}
				<span class="text-sm">
					{name}
				</span>
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content side="right">
		<p>{name}</p>
	</Tooltip.Content>
</Tooltip.Root>
