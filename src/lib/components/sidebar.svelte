<script lang="ts">
	import {
		CalendarDaysIcon,
		Home,
		HomeIcon,
		SettingsIcon,
		TreesIcon,
		UsersIcon
	} from 'lucide-svelte';
	import { page } from '$app/stores';

	$: pathname = new URL($page.url).pathname;
</script>

<aside class="max-w-[200px]">
	<a href="/dashboard" class="p-1">
		<img
			src="/logo-light.png"
			alt="logo"
			width={200}
			height={140}
			class="contain mx-auto block h-auto w-1/2"
		/>
	</a>

	<nav class="mt-6">
		<ul class="flex w-full flex-col gap-3">
			<li class="pl-3 text-sm">
				<a
					href="/dashboard"
					class="flex items-center gap-2 p-2"
					class:active={pathname === '/dashboard'}
					class:inactive={pathname !== '/dashboard'}
				>
					<HomeIcon class="h-4 w-5" />
					Dashboard
				</a>
			</li>
			<li class="pl-3 text-sm">
				<a
					href="/bookings"
					class="flex items-center gap-2 p-2"
					class:active={pathname === '/bookings'}
					class:inactive={pathname !== '/bookings'}
				>
					<CalendarDaysIcon class="h-4 w-5" />
					Bookings
				</a>
			</li>
			<li class="pl-3 text-sm">
				<a
					href="/cabins"
					class="flex items-center gap-2 p-2"
					class:active={pathname === '/cabins'}
					class:inactive={pathname !== '/cabins'}
				>
					<TreesIcon class="h-4 w-5" />
					Cabins
				</a>
			</li>
			<li class="pl-3 text-sm">
				<a
					href="/users"
					class="flex items-center gap-2 p-2"
					class:active={pathname === '/users'}
					class:inactive={pathname !== '/users'}
				>
					<UsersIcon class="h-4 w-5" />
					Users
				</a>
			</li>
			<li class="pl-3 text-sm">
				<a
					href="/settings"
					class="flex items-center gap-2 p-2"
					class:active={pathname === '/settings'}
					class:inactive={pathname !== '/settings'}
				>
					<SettingsIcon class="h-4 w-5" />
					Settings
				</a>
			</li>
		</ul>
	</nav>
</aside>

<style>
	.active {
		@apply rounded bg-neutral-200;
	}

	.inactive {
		@apply font-light opacity-70;
	}

	.inactive:hover {
		@apply rounded bg-neutral-200;
	}
</style>
