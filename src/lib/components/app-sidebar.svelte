<script lang="ts">
	import { page } from '$app/stores';
	import {
		HomeIcon,
		CalendarIcon,
		SettingsIcon,
		UsersIcon,
		FlameKindlingIcon
	} from 'lucide-svelte';

	import { cn } from '$lib/utils';
	import logo from '$lib/assets/logo-light.png';

	const LINKS = [
		{ label: 'Home', href: '/dashboard', current: true, icon: HomeIcon },
		{ label: 'Bookings', href: '/bookings', current: false, icon: CalendarIcon },
		{ label: 'Cabins', href: '/cabins', current: false, icon: FlameKindlingIcon },
		{ label: 'Users', href: '/users', current: false, icon: UsersIcon },
		{ label: 'Settings', href: '/settings', current: false, icon: SettingsIcon }
	];
</script>

<aside class="row-span-full border-r">
	<div>
		<img src={logo} alt="logo" class="mx-auto my-8 w-20" />
	</div>

	<!-- Navigation Links -->
	<nav class="flex flex-col space-y-2 px-4">
		{#each LINKS as { href, label, icon } (label)}
			<a
				{href}
				class={cn(
					'flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors duration-200',
					{
						'bg-gray-200 font-semibold text-primary':
							href === $page.route.id || $page.route.id?.startsWith(href),
						'hover:bg-gray-200': href !== $page.route.id
					}
				)}
			>
				<svelte:component this={icon} class="h-4 w-4" />
				<span>{label}</span>
			</a>
		{/each}
	</nav>
</aside>
