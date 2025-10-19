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
	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuBadge,
		SidebarMenuButton,
		SidebarMenuItem,
		useSidebar
	} from '$lib/components/ui/sidebar';
	import { APP_NAME } from '$lib/config/constants';

	const SIDEBAR_ITEMS = [
		{ title: 'Home', path: '/admin', icon: HouseIcon, badge: false },
		{ title: 'Bookings', path: '/admin/bookings', icon: CalendarIcon, badge: true },
		{ title: 'Cabins', path: '/admin/cabins', icon: FlameKindlingIcon, badge: false },
		{ title: 'Messages', path: '/admin/messages', icon: MessageSquareIcon, badge: false },
		{ title: 'Subscribers', path: '/admin/subscribers', icon: MailIcon, badge: false },
		{ title: 'Users', path: '/admin/users', icon: UsersIcon, badge: false }
	];

	const sidebar = useSidebar();
</script>

<Sidebar variant="floating" collapsible="icon">
	<SidebarHeader>
		<a href="/admin" class="flex items-center gap-2">
			<img src={logo} alt="logo" class="h-8 w-auto" width={24} height={24} />
			{#if sidebar.open}
				<span class="text-lg font-semibold">{APP_NAME}</span>
			{/if}
		</a>
	</SidebarHeader>

	<SidebarContent>
		<SidebarGroup>
			<SidebarGroupLabel>Navigation Menu</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu class="mt-2 space-y-3">
					{#each SIDEBAR_ITEMS as item}
						<SidebarMenuItem>
							<SidebarMenuButton
								tooltipContent={item.title}
								isActive={page.url.pathname === item.path}
							>
								{#snippet child({ props })}
									<a href={item.path} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</SidebarMenuButton>

							{#if item.badge}
								<SidebarMenuBadge>24</SidebarMenuBadge>
							{/if}
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</SidebarContent>

	<SidebarFooter>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					tooltipContent="Settings"
					isActive={page.url.pathname === '/admin/settings'}
				>
					{#snippet child({ props })}
						<a href="/admin/settings" {...props}>
							<SettingsIcon />
							<span>Settings</span>
						</a>
					{/snippet}
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</Sidebar>
