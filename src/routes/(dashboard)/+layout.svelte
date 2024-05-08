<script lang="ts">
	import {
		CalendarIcon,
		ChevronRightIcon,
		CircleUserRoundIcon,
		FlameKindlingIcon,
		HomeIcon,
		Settings2Icon,
		UsersIcon
	} from 'lucide-svelte';

	import { cn } from '$lib/utils';
	import Breadcrumbs from '$lib/components/breadcrumbs.svelte';
	import NavLink from '$lib/components/nav-link.svelte';

	let isOpen = false;

	const links = [
		{ label: 'Home', href: '/overview', icon: HomeIcon },
		{ label: 'Bookings', href: '/bookings', icon: CalendarIcon },
		{ label: 'Cabins', href: '/cabins', icon: FlameKindlingIcon },
		{ label: 'Users', href: '/users', icon: UsersIcon },
		{ label: 'Settings', href: '/settings', icon: Settings2Icon }
	];

	const bottomLinks = [{ label: 'Account', href: '/account', icon: CircleUserRoundIcon }];
</script>

<div class="flex min-h-screen">
	<aside
		class={cn(
			'fixed inset-y-0 z-10 flex flex-col border-r bg-white p-3 duration-300',
			isOpen ? 'w-40' : 'w-14'
		)}
	>
		<button
			class={cn(
				'absolute -right-3 top-10 z-10 rounded-full border border-muted-foreground bg-white p-1 text-primary'
			)}
			on:click={() => (isOpen = !isOpen)}
		>
			<ChevronRightIcon
				class={cn('size-4 text-primary duration-300', isOpen ? 'rotate-180' : '')}
			/>
			<span class="sr-only">Toggle Sidebar</span>
		</button>

		<nav class="mt-24 flex flex-col space-y-2">
			{#each links as { label, href, icon } (label)}
				<NavLink {label} {href} {icon} {isOpen} />
			{/each}
		</nav>

		<nav class="mt-auto flex flex-col space-y-2">
			{#each bottomLinks as { label, href, icon } (label)}
				<NavLink {label} {href} {icon} {isOpen} />
			{/each}
		</nav>
	</aside>
	<div class={cn('flex w-full flex-col px-8 duration-300', isOpen ? 'ml-40' : 'ml-14')}>
		<header class="flex h-20 items-center">
			<Breadcrumbs />
		</header>
		<main class="mb-8 flex-1">
			<slot />
		</main>
	</div>
</div>
