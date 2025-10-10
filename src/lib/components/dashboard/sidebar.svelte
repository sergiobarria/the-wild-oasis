<script lang="ts">
	import {
		CalendarIcon,
		FlameKindlingIcon,
		HouseIcon,
		MailIcon,
		MessageSquareIcon,
		SettingsIcon,
		UsersIcon
	} from '@lucide/svelte';

	import { page } from '$app/state';
	import logo from '$lib/assets/logo-2.webp';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { APP_NAME } from '$lib/config/constants';
	import { cn } from '$lib/utils';

	import { buttonVariants } from '../ui/button';

	const SIDEBAR_ITEMS = [
		{
			title: 'Home',
			url: '/admin',
			icon: HouseIcon,
			badge: false
		},
		{
			title: 'Bookings',
			url: '/admin/bookings',
			icon: CalendarIcon,
			badge: true
		},
		{
			title: 'Cabins',
			url: '/admin/cabins',
			icon: FlameKindlingIcon,
			badge: false
		},
		{
			title: 'Messages',
			url: '/admin/messages',
			icon: MessageSquareIcon,
			badge: false
		},

		{
			title: 'Subscribers',
			url: '/admin/subscribers',
			icon: MailIcon,
			badge: false
		},
		{
			title: 'Users',
			url: '/admin/users',
			icon: UsersIcon,
			badge: false
		}
	];
</script>

<Sidebar.Root variant="sidebar" collapsible="icon">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="h-12 hover:bg-transparent">
					{#snippet child({ props })}
						<a href="/admin" {...props} class="flex items-center p-0">
							<img src={logo} alt="logo" width="35" height="35" />
							{#if Sidebar.useSidebar().open}
								<span class="ml-2 font-bold whitespace-nowrap">{APP_NAME}</span>
							{/if}
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Navigation Menu</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each SIDEBAR_ITEMS as item (item.title)}
						{@const isActive = page.url.pathname === item.url}

						<Sidebar.MenuItem>
							{#if Sidebar.useSidebar().open}
								<Sidebar.MenuButton {isActive}>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
								{#if item.badge}
									<Sidebar.MenuBadge>24</Sidebar.MenuBadge>
								{/if}
							{:else}
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger class="w-full">
											{@const isActive = page.url.pathname === item.url}
											<Sidebar.MenuButton {isActive}>
												{#snippet child({ props })}
													<a href={item.url} {...props}>
														<item.icon class={cn(isActive && 'text-primary')} />
														<span>{item.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuButton>
										</Tooltip.Trigger>
										<Tooltip.Content side="right">
											<p>{item.title}</p>
										</Tooltip.Content>
									</Tooltip.Root>
								</Tooltip.Provider>
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
				{#if Sidebar.useSidebar().open}
					<Sidebar.MenuButton isActive={page.url.pathname === '/admin/settings'}>
						{#snippet child({ props })}
							<a href="/admin/settings" {...props}>
								<SettingsIcon />
								<span>Settings</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				{:else}
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger class="w-full">
								{@const isActive = page.url.pathname === '/admin/settings'}
								<Sidebar.MenuButton {isActive}>
									{#snippet child({ props })}
										<a href="/admin/settings" {...props}>
											<SettingsIcon class={cn(isActive && 'text-primary')} />
											<span>Settings</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Tooltip.Trigger>
							<Tooltip.Content side="right">
								<p>Settings</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{/if}
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
