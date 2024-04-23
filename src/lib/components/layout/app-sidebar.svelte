<script lang="ts">
	import { page } from '$app/stores';
	import { HomeIcon, CalendarIcon, SettingsIcon, UsersIcon, FlameKindlingIcon } from 'lucide-svelte';

	import { cn } from '$lib/utils';
	import logo from '$lib/assets/logo-light.png';

	const LINKS = [
		{ label: 'Home', href: '/dashboard', exact: true, icon: HomeIcon },
		{ label: 'Bookings', href: '/dashboard/bookings', exact: false, icon: CalendarIcon },
		{ label: 'Cabins', href: '/dashboard/cabins', exact: false, icon: FlameKindlingIcon },
		{ label: 'Users', href: '/dashboard/users', exact: false, icon: UsersIcon },
		{ label: 'Settings', href: '/dashboard/settings', exact: false, icon: SettingsIcon }
	];

	$: isActive = (href: string, isExact = false) => {
		if (isExact) {
			return $page.url.pathname === href;
		}

		return $page.url.pathname.startsWith(href);
	};
</script>

<aside class="row-span-full border-r">
	<div>
		<img src={logo} alt="logo" class="mx-auto my-8 w-20" />
	</div>

	<!-- Navigation Links -->
	<nav class="flex flex-col space-y-2 px-4">
		{#each LINKS as { href, label, icon, exact } (label)}
			<a
				{href}
				class={cn('flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors duration-200', {
					'bg-gray-200 font-semibold text-primary': isActive(href, exact),
					'hover:bg-gray-200': !isActive(href, exact)
				})}
			>
				<svelte:component this={icon} class="h-4 w-4" />
				<span>{label}</span>
			</a>
		{/each}
	</nav>
</aside>
