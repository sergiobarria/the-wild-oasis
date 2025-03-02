<script lang="ts">
	import {
		BuildingIcon,
		CalendarCheckIcon,
		HomeIcon,
		SettingsIcon,
		UsersIcon
	} from 'lucide-svelte';

	import { page } from '$app/state';
	import { useSidebarContext } from '$lib/context/sidebar-context.svelte';

	const sidebar = useSidebarContext();

	const LINKS = [
		{ name: 'Home', icon: HomeIcon, href: '/admin', exact: true },
		{ name: 'Bookings', icon: CalendarCheckIcon, href: '/admin/bookings', exact: false },
		{ name: 'Cabins', icon: BuildingIcon, href: '/admin/cabins', exact: false },
		{ name: 'Users', icon: UsersIcon, href: '/admin/users', exact: false },
		{ name: 'Settings', icon: SettingsIcon, href: '/admin/settings', exact: false }
	];

	function isActive(href: string, exact: boolean) {
		if (exact) return page.route.id === href;

		return page.route.id?.includes(href);
	}
</script>

<aside
	class={[
		'hidden h-full border-r border-gray-300 p-3 transition-all duration-300 ease-in-out md:block',
		sidebar.open ? 'w-[14rem]' : 'w-[4rem]'
	]}
>
	<div class="flex h-16 items-center justify-center border-b border-gray-300">
		<span class="text-xl font-bold transition-opacity duration-300 ease-in-out"> Logo </span>
	</div>

	<!-- Navigation Links -->
	<nav class="mt-6 flex-1 space-y-2">
		{#each LINKS as link}
			<div class={[!sidebar.open && 'tooltip tooltip-right']} data-tip={link.name}>
				<a
					href={link.href}
					class={[
						'flex items-center rounded-lg p-2 transition-all duration-300 ease-in-out',
						isActive(link.href, link.exact) ? 'bg-accent' : 'hover:bg-accent'
					]}
				>
					<link.icon class="size-5" />
					<span
						class={[
							'ml-3 text-sm transition-opacity duration-300 ease-in-out',
							!sidebar.open && 'hidden'
						]}
					>
						{link.name}
					</span>
				</a>
			</div>
		{/each}
	</nav>
</aside>
