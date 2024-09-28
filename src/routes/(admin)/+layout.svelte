<script lang="ts">
	import { page } from '$app/stores';
	import { SettingsIcon } from 'lucide-svelte';

	import ModeToggle from '$lib/components/site/mode-toggle.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	import logoDarkSm from '$lib/assets/logo-dark-sm.webp?enhanced';

	let { children } = $props();

	const LINKS = [
		{ label: 'Bookings', href: '/dashboard/bookings' },
		{ label: 'Cabins', href: '/dashboard/cabins' },
		{ label: 'Users', href: '/dashboard/users' }
	];
</script>

<svelte:head>
	<title>Admin | The Wild Oasis</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="flex h-16 items-center justify-between border-b px-4 lg:px-6">
		<div class="flex items-center gap-6">
			<div>
				<a href="/dashboard">
					<enhanced:img src={logoDarkSm} alt="The Wild Oasis" class="h-8 w-auto" />
					<span class="sr-only">The Wild Oasis</span>
				</a>
			</div>
			<nav class="flex items-center gap-3 text-sm">
				{#each LINKS as { label, href } (label)}
					{@const isActive = $page.url.pathname.startsWith(href)}

					<div>
						<a
							{href}
							class={cn(
								'rounded-lg px-2.5 py-1.5 font-semibold transition-colors duration-300',
								isActive ? 'bg-muted' : 'text-muted-foreground'
							)}
						>
							{label}
						</a>
					</div>
				{/each}
			</nav>
		</div>
		<div class="flex items-center gap-6">
			<div class="space-x-1">
				<Button
					variant="ghost"
					size="icon"
					href="/dashboard/settings"
					class={cn($page.url.pathname.includes('settings') && 'bg-muted')}
				>
					<SettingsIcon class="size-4" />
				</Button>
				<ModeToggle />
			</div>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>WO</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</header>
	<main class="flex-1">
		<div class="mx-auto my-8 h-full max-w-screen-xl px-4 lg:px-6">
			{@render children()}
		</div>
	</main>
</div>
