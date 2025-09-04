<script lang="ts">
	import {
		CalendarIcon,
		FlameKindlingIcon,
		HouseIcon,
		Settings2Icon,
		UsersIcon
	} from '@lucide/svelte';

	import { page } from '$app/state';
	import logo from '$lib/assets/logo.webp';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { cn } from '$lib/utils';

	const sidebar = useSidebar();

	const items = [
		{
			title: 'Home',
			href: '/admin',
			icon: HouseIcon
		},
		{
			title: 'Cabins',
			href: '/admin/cabins',
			icon: FlameKindlingIcon
		},
		{
			title: 'Bookings',
			href: '/admin/bookings',
			icon: CalendarIcon
		},
		{
			title: 'Users',
			href: '/admin/users',
			icon: UsersIcon
		}
	];
</script>

<Sidebar.Root variant="sidebar" collapsible="icon" class="relative">
	<Sidebar.Header class={cn(sidebar.open && 'p-4')}>
		<div class="flex items-center gap-3">
			{#if sidebar.open}
				<img class="rounded-full" src={logo} alt="logo" width="35" height="35" />
				<div>
					<p class="text-sm font-bold">The Wild Oasis</p>
					<p class="text-xs text-muted-foreground">Admin Panel</p>
				</div>
			{:else}
				<img class="rounded-full" src={logo} alt="logo" width="30" height="30" />
			{/if}
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="mt-6">
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="space-y-2.5">
					{#each items as item (item.href)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={page.url.pathname === item.href}>
								{#snippet child({ props })}
									<a href={item.href} {...props}>
										{#if sidebar.open}
											<item.icon class="size-4" />
											<span>{item.title}</span>
										{:else}
											<Tooltip.Provider>
												<Tooltip.Root>
													<Tooltip.Trigger>
														<item.icon class="size-4" />
													</Tooltip.Trigger>
													<Tooltip.Content side="right">
														<p>{item.title}</p>
													</Tooltip.Content>
												</Tooltip.Root>
											</Tooltip.Provider>
										{/if}
									</a>
								{/snippet}
							</Sidebar.MenuButton>
							{#if item.title === 'Bookings'}
								<Sidebar.MenuBadge>3</Sidebar.MenuBadge>
							{/if}
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href="/admin/settings" {...props}>
							{#if sidebar.open}
								<Settings2Icon class="size-4" />
								<span>Settings</span>
							{:else}
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger>
											<Settings2Icon class="size-4" />
										</Tooltip.Trigger>
										<Tooltip.Content side="right">
											<p>Settings</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</Tooltip.Provider>
							{/if}
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
