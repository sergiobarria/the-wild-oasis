<script lang="ts">
	import { CalendarDaysIcon, HomeIcon, SettingsIcon, TreesIcon, UsersIcon } from 'lucide-svelte';
	import { page } from '$app/stores';

	import NavLink from './nav-link.svelte';
	import { cn } from '$lib/utils';

	// const links = [
	// 	{ id: 0, name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
	// 	{ id: 1, name: 'Bookings', href: '/bookings', icon: CalendarDaysIcon },
	// 	{ id: 2, name: 'Cabins', href: '/cabins', icon: TreesIcon },
	// 	{ id: 3, name: 'Users', href: '/users', icon: UsersIcon },
	// 	{ id: 4, name: 'Settings', href: '/settings', icon: SettingsIcon }
	// ];

	$: pathname = new URL($page.url).pathname;
</script>

<aside class="row-span-full flex flex-col gap-14 border-r border-neutral-100 bg-white p-4">
	<a href="/dashboard">
		<div class="flex justify-center">
			<img src="/logo-light.png" alt="logo" width={200} height={200} class="h-16 w-auto" />
		</div>
	</a>

	<!-- Sidebar Navigation -->
	<nav>
		<ul class="flex flex-col gap-3">
			<NavLink href="/dashboard" name="Dashboard">
				<HomeIcon
					class={cn(
						'h-5 w-5 opacity-70 group-hover:text-primary',
						pathname === '/dashboard' && 'text-primary opacity-100'
					)}
				/>
			</NavLink>
			<NavLink href="/bookings" name="Bookins">
				<CalendarDaysIcon
					class={cn(
						'h-5 w-5 opacity-70 group-hover:text-primary',
						pathname === '/bookings' && 'text-primary opacity-100'
					)}
				/>
			</NavLink>
			<NavLink href="/cabins" name="Cabins">
				<TreesIcon
					class={cn(
						'h-5 w-5 opacity-70 group-hover:text-primary',
						pathname === '/cabins' && 'text-primary opacity-100'
					)}
				/>
			</NavLink>
			<NavLink href="/users" name="Users">
				<UsersIcon
					class={cn(
						'h-5 w-5 opacity-70 group-hover:text-primary',
						pathname === '/users' && 'text-primary opacity-100'
					)}
				/>
			</NavLink>
			<NavLink href="/settings" name="Settings">
				<SettingsIcon
					class={cn(
						'h-5 w-5 opacity-70 group-hover:text-primary',
						pathname === '/settings' && 'text-primary opacity-100'
					)}
				/>
			</NavLink>
		</ul>
	</nav>
</aside>
