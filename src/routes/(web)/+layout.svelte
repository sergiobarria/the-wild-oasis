<script lang="ts">
	import { LogInIcon, LogOutIcon, UserIcon } from '@lucide/svelte';

	import { page } from '$app/state';
	import logo from '$lib/assets/logo-2.webp';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
	import { cn } from '$lib/utils';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header class="border-b px-8 py-3">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<a href="/" class="z-10 flex items-center gap-2">
				<img src={logo} alt="logo" width="40" height="40" />
				<span class="text-xl font-semibold">{APP_NAME}</span>
			</a>

			<nav class="flex items-center gap-8">
				<a
					href="/cabins"
					class={cn(
						'transition-colors duration-300 ease-in-out hover:text-primary',
						page.url.pathname === '/cabins' && 'text-primary'
					)}
				>
					Cabins
				</a>
				<a
					href="/about"
					class={cn(
						'transition-colors duration-300 ease-in-out hover:text-primary',
						page.url.pathname === '/about' && 'text-primary'
					)}
				>
					About
				</a>
				<a
					href="/contact"
					class={cn(
						'transition-colors duration-300 ease-in-out hover:text-primary',
						page.url.pathname === '/contact' && 'text-primary'
					)}
				>
					Contact
				</a>

				<div class="flex items-center gap-3">
					<Button href="/admin" size="sm">Guest Area</Button>
					<Button href="/admin" size="sm" variant="outline">Dashboard</Button>
					<Button size="sm" variant="outline">
						<LogOutIcon />
						Logout
					</Button>
				</div>

				<div class="flex items-center gap-3">
					<Button href="/sign-up" size="sm" variant="outline">
						<UserIcon />
						Sign Up
					</Button>
					<Button href="/sign-in" size="sm" variant="outline">
						<LogInIcon />
						Sign In
					</Button>
				</div>
			</nav>
		</div>
	</header>

	<div class="flex-1">
		<main class="w-full">
			{@render children()}
		</main>
	</div>

	<footer>footer</footer>
</div>
