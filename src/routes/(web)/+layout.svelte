<script lang="ts">
	import { MailIcon, MapPinIcon, PhoneIcon } from '@lucide/svelte';

	import { page } from '$app/state';
	import logo from '$lib/assets/logo-2.webp';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '$lib/config/constants';
	import { cn } from '$lib/utils';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const LINKS = [
		{ href: '/cabins', label: 'Cabins' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	const session = null; // TODO: Placeholder for future session handling
</script>

<div class="flex min-h-screen flex-col">
	<header class="border-b px-8 py-3">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<img src={logo} alt="logo" width={40} height={40} />
				<span class="text-xl">{APP_NAME}</span>
			</a>

			<nav class="flex items-center gap-8">
				{#each LINKS as { href, label }}
					<a
						{href}
						class={cn(
							'transition-colors duration-300 ease-in-out hover:text-primary',
							page.url.pathname === href && 'text-primary'
						)}
					>
						{label}
					</a>
				{/each}
			</nav>

			{#if session}
				<div class="flex items-center gap-3">
					<Button href="/guest" size="sm">Guest Area</Button>
					<!-- TODO: Only admins can see the dashboard button -->
					<Button href="/admin" size="sm" variant="outline">Dashboard</Button>
				</div>
			{:else}
				<div class="flex items-center gap-3">
					<Button href="/sign-in" size="sm" variant="outline">Sign In</Button>
					<Button href="/sign-up" size="sm" variant="outline">Sign Up</Button>
				</div>
			{/if}
		</div>
	</header>

	<div class="flex-1">
		<main class="w-full">
			{@render children()}
		</main>
	</div>

	<footer class="border-t text-sm">
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 py-8 md:grid-cols-3">
			<!-- Logo -->
			<div>
				<a href="/" class="mb-4 flex items-center gap-4">
					<img src={logo} alt="The Wild Oasis logo" width="40" height="40" />
					<span class="text-lg font-semibold">The Wild Oasis</span>
				</a>
				<Typography variant="body" class="max-w-xs leading-relaxed text-muted-foreground">
					Luxury cabins in the heart of the Dolomites. Unwind, reconnect, and experience the magic
					of nature.
				</Typography>
			</div>

			<!-- Footer Navigation -->
			<div>
				<Typography variant="h4" class="mb-4">Explore</Typography>
				<ul class="space-y-2">
					{#each LINKS as { href, label }}
						<li>
							<a {href} class="text-muted-foreground transition-colors hover:text-primary">
								{label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<Typography variant="h4" class="mb-4">Contact</Typography>
				<ul class="space-y-3">
					<li>
						<div class="flex items-center gap-2">
							<MailIcon class="size-4 text-primary" />
							<a href={`mailto:${CONTACT_EMAIL}`} class="transition-colors hover:text-primary">
								{CONTACT_EMAIL}
							</a>
						</div>
					</li>
					<li>
						<div class="flex items-center gap-2">
							<PhoneIcon class="size-4 text-primary" />
							<a href={`tel:${CONTACT_PHONE}`} class="transition-colors hover:text-primary">
								{CONTACT_PHONE}
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

		<div class="border-t px-8 py-6 text-center text-xs text-muted-foreground">
			© {new Date().getFullYear()}
			{APP_NAME}. All rights reserved.
		</div>
	</footer>
</div>
