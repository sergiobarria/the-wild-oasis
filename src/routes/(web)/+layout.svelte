<script lang="ts">
	import {
		Layers2Icon,
		LogInIcon,
		MailIcon,
		MapPinIcon,
		PhoneIcon,
		UserIcon
	} from '@lucide/svelte';

	import { page } from '$app/state';
	import logo from '$lib/assets/logo-2.webp';
	import SignOutButton from '$lib/components/shared/sign-out-button.svelte';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
	import { cn } from '$lib/utils';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const LINKS = [
		{ href: '/cabins', label: 'Cabins' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

{#snippet footerLink({ href, label }: { href: string; label: string })}
	<Button
		{href}
		size="sm"
		variant="link"
		class={cn('px-0 text-muted-foreground', page.url.pathname.includes(href) && 'text-primary')}
	>
		{label}
	</Button>
{/snippet}

<div class="flex min-h-screen flex-col">
	<header class="border px-5 py-3">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<img src={logo} alt={APP_NAME} width={40} height={40} />
				<span class="text-lg font-semibold">{APP_NAME}</span>
			</a>

			<nav class="flex items-center gap-8">
				{#each LINKS as { href, label }}
					<a
						{href}
						class={cn(
							'transition-colors duration-300 ease-in-out hover:text-primary',
							page.url.pathname.includes(href) && 'text-primary'
						)}>{label}</a
					>
				{/each}

				<div class="flex items-center gap-2">
					{#if data.session}
						<Button href="/guest" size="sm">
							<UserIcon class="size-4" />
							Guest Area
						</Button>

						<Button href="/admin" size="sm" variant="outline">
							<Layers2Icon class="size-4" />
							Dashboard
						</Button>

						<SignOutButton withLabel size="sm" variant="outline" />
					{:else}
						<Button href="/sign-in" size="sm">
							<LogInIcon class="size-4" />
							Sign In
						</Button>

						<Button href="/sign-up" size="sm" variant="outline">
							<UserIcon class="size-4" />
							Sign Up
						</Button>
					{/if}
				</div>
			</nav>
		</div>
	</header>

	<div class="flex-1">
		<main class="w-full">
			{@render children()}
		</main>
	</div>

	<footer class="bg-base-100 border-t border-zinc-800 text-sm text-zinc-400">
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 py-16 md:grid-cols-3">
			<!-- Logo -->
			<div>
				<a href="/" class="mb-4 flex items-center gap-4">
					<img src={logo} alt={APP_NAME} width="40" height="40" />
					<span class="text-lg font-semibold text-zinc-100">{APP_NAME}</span>
				</a>
				<p class="max-w-xs leading-relaxed">
					Luxury cabins in the heart of the Dolomites. Unwind, reconnect, and experience the magic
					of nature.
				</p>
			</div>

			<!-- Navigation -->
			<div>
				<h4 class="mb-4 font-medium text-zinc-100">Explore</h4>
				<ul class="space-y-2">
					<li>
						{@render footerLink({ href: '/cabins', label: 'Cabins' })}
					</li>
					<li>
						{@render footerLink({ href: '/about', label: 'About Us' })}
					</li>
					<li>
						{@render footerLink({ href: '/contact', label: 'Contact' })}
					</li>
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h4 class="mb-4 font-medium text-zinc-100">Contact</h4>
				<ul class="space-y-3">
					<li>
						<div class="flex items-center gap-2">
							<MailIcon class="size-4 text-primary" />
							<a href="mailto:hello@thewildoasis.com" class="transition-colors hover:text-primary">
								hello@thewildoasis.com
							</a>
						</div>
					</li>
					<li>
						<div class="flex items-center gap-2">
							<PhoneIcon class="size-4 text-primary" />
							<a href="tel:+1234567890" class="transition-colors hover:text-primary">
								+1 (234) 567-890
							</a>
						</div>
					</li>
					<li>
						<div class="flex items-start gap-2">
							<MapPinIcon class="mt-1 size-4 text-primary" />
							<span class="leading-snug">
								Via delle Dolomiti 25
								<br />
								39030 Cortina d'Ampezzo (BZ), Italy
							</span>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<div class="border-t border-zinc-800 px-8 py-6 text-center text-xs text-zinc-500">
			© {new Date().getFullYear()}
			{APP_NAME}. All rights reserved.
		</div>
	</footer>
</div>
