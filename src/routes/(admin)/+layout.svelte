<script lang="ts">
	import { page } from '$app/stores';
	import {
		PanelLeftOpenIcon,
		PanelLeftCloseIcon,
		HomeIcon,
		CalendarIcon,
		FlameKindlingIcon,
		UsersIcon,
		SettingsIcon
	} from 'lucide-svelte';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import NavLink from './_components/nav-link.svelte';

	let { children } = $props();
	let isOpen = $state<boolean>(true);

	const breadcrumbs = $derived.by(() => {
		const parts = $page.url.pathname.split('/').filter(Boolean); // .filter(Boolean) removes empty strings

		return parts.map((part, index) => {
			const href = `/${parts.slice(0, index + 1).join('/')}`;

			return { part, href };
		});
	});

	const links = [
		{ name: 'Home', href: '/admin', icon: HomeIcon, exact: true },
		{ name: 'Bookings', href: '/admin/bookings', icon: CalendarIcon, exact: false },
		{ name: 'Cabins', href: '/admin/cabins', icon: FlameKindlingIcon, exact: false },
		{ name: 'Users', href: '/admin/users', icon: UsersIcon, exact: false }
	];

	const settings = { name: 'Settings', href: '/admin/settings', icon: SettingsIcon, exact: false };
</script>

<svelte:head>
	<title>Admin | The Wild Oasis</title>
</svelte:head>

<div class="min-h-screen w-full bg-gray-100">
	<aside
		class={cn(
			'fixed inset-y-0 left-0 hidden border-r bg-white p-3 transition-all duration-300 ease-in-out sm:flex',
			isOpen ? 'w-56' : 'w-16'
		)}
	>
		<div class="flex w-full flex-col items-start gap-4 sm:py-4">
			<Button variant="ghost" size="icon" on:click={() => (isOpen = !isOpen)} class="p-0" title="Toggle panel">
				{#if isOpen}
					<PanelLeftCloseIcon class="size-6 opacity-70" />
				{:else}
					<PanelLeftOpenIcon class="size-6 opacity-70" />
				{/if}
			</Button>

			<nav
				class={cn('mt-4 flex w-full space-y-2.5', {
					'flex-col items-center': !isOpen,
					'flex-col items-stretch': isOpen
				})}
			>
				{#each links as { name, href, icon, exact } (name)}
					<NavLink {name} {href} {icon} {exact} {isOpen} />
				{/each}
			</nav>

			<div class="mb mt-auto w-full px-2">
				<NavLink
					name={settings.name}
					href={settings.href}
					icon={settings.icon}
					exact={settings.exact}
					{isOpen}
				/>
			</div>
		</div>
	</aside>

	<div
		class={cn(
			'flex h-full min-h-screen w-full flex-col px-6 transition-all duration-300 ease-in-out',
			isOpen ? 'ml-56' : 'ml-16'
		)}
	>
		<header class="flex h-20 items-center justify-between">
			<Breadcrumb.Root>
				<Breadcrumb.List>
					{#each breadcrumbs as { href, part }, i (part)}
						<Breadcrumb.Item>
							<Breadcrumb.Link {href} class="capitalize">{part}</Breadcrumb.Link>
						</Breadcrumb.Item>

						{#if i !== breadcrumbs.length - 1}
							<Breadcrumb.Separator />
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<div>avatar</div>
		</header>
		<main class="flex-1">
			<!-- NOTE: New Svelte 5 syntax to render children -->
			{@render children()}
		</main>
	</div>
</div>
