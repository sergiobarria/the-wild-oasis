<script lang="ts">
	import {
		CalendarIcon,
		ChevronRightIcon,
		FlameKindlingIcon,
		HomeIcon,
		SettingsIcon,
		UserIcon
	} from 'lucide-svelte';
	import { mode } from 'mode-watcher';

	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { page } from '$app/stores';
	import { Button } from '../ui/button';
	import { cn } from '$lib/utils';

	const MENU_ITEMS = [
		{
			title: 'Home',
			url: '/dashboard',
			icon: HomeIcon
		},
		{
			title: 'Bookings',
			url: '/dashboard/bookings',
			icon: CalendarIcon
		},
		{
			title: 'Cabins',
			url: '/dashboard/cabins',
			icon: FlameKindlingIcon
		},
		{
			title: 'Users',
			url: '/dashboard/users',
			icon: UserIcon
		},
		{
			title: 'Settings',
			url: '/dashboard/settings',
			icon: SettingsIcon
		}
	];

	const sidebar = useSidebar();
</script>

{#snippet sidebarHeader()}
	{@const src = sidebar.open
		? $mode === 'dark'
			? '/logo-dark.webp'
			: '/logo-light.webp'
		: $mode === 'dark'
			? '/logo-dark-sm.webp'
			: '/logo-light-sm.webp'}
	<img {src} alt="Logo" width={175} height={75} class="size-full object-contain" />
{/snippet}

<Sidebar.Root variant="sidebar" collapsible="icon">
	<Sidebar.Header>
		<div class="h-auto max-h-20 w-full">
			{@render sidebarHeader()}
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="relative overflow-visible group-data-[collapsible=icon]:overflow-visible">
		<Button
			variant="outline"
			size="icon"
			onclick={() => sidebar.toggle()}
			title={sidebar.open ? 'Close Sidebar' : 'Open Sidebar'}
			class={cn(
				'absolute -right-5 bottom-40 z-50 rounded-full p-0.5',
				sidebar.open && 'rotate-180'
			)}
		>
			<ChevronRightIcon class="size-5" />
		</Button>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each MENU_ITEMS as item (item.title)}
						{@const isActive =
							item.title === 'Home'
								? $page.url.pathname === item.url
								: $page.url.pathname.includes(item.url)}

						<Sidebar.MenuItem>
							<Sidebar.MenuButton {isActive}>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										{#if sidebar.open}
											<item.icon />
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
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
