<script>
	import { page } from '$app/stores'
	import {
		HomeIcon,
		CalendarIcon,
		SettingsIcon,
		UsersIcon,
		FlameKindlingIcon
	} from 'lucide-svelte'
	import { Toaster } from 'svelte-french-toast'

	import { cn } from '$lib/utils'
	import logo from '$lib/assets/logo-light.png'
	import '../app.pcss'

	const links = [
		{ label: 'Home', href: '/dashboard', current: true, icon: HomeIcon },
		{ label: 'Bookins', href: '/bookings', current: false, icon: CalendarIcon },
		{ label: 'Cabins', href: '/cabins', current: false, icon: FlameKindlingIcon },
		{ label: 'Users', href: '/users', current: false, icon: UsersIcon },
		{ label: 'Settings', href: '/settings', current: false, icon: SettingsIcon }
	]
</script>

<div class="flex min-h-screen gap-4">
	<aside class="w-full min-w-[150px] max-w-[175px] px-4 py-6">
		<div class="mb-12 flex items-center justify-center">
			<img src={logo} alt="logo" width="75" />
		</div>
		<nav class="space-y-2">
			{#each links as link}
				<a
					href={link.href}
					class={cn(
						'flex items-center gap-3 rounded-md px-2 py-3 text-xs transition-colors duration-200 ease-in-out',
						{
							'bg-neutral-100 font-medium text-primary':
								link.href === $page.route.id ||
								$page.route.id?.startsWith(link.href),
							'text-neutral-500 hover:bg-neutral-100': link.href !== $page.route.id
						}
					)}
				>
					<svelte:component this={link.icon} class="h-4 w-4" />
					<span>{link.label}</span>
				</a>
			{/each}
		</nav>
	</aside>
	<div class="flex flex-1 flex-col px-4">
		<header class="flex h-16 items-center">HEADER</header>
		<main class="flex-1 py-6">
			<slot />
		</main>
	</div>
	<Toaster />
</div>
