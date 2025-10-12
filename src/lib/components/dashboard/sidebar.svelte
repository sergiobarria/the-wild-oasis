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
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import { APP_NAME } from '$lib/config/constants';
	import { cn } from '$lib/utils';

	const sidebar = useSidebar();

	const SIDEBAR_ITEMS = [
		{ title: 'Home', href: '/admin', icon: HouseIcon, badge: false },
		{ title: 'Bookings', href: '/admin/bookings', icon: CalendarIcon, badge: true },
		{ title: 'Cabins', href: '/admin/cabins', icon: FlameKindlingIcon, badge: false },
		{ title: 'Messages', href: '/admin/messages', icon: MessageSquareIcon, badge: false },
		{ title: 'Subscribers', href: '/admin/subscribers', icon: MailIcon, badge: false },
		{ title: 'Users', href: '/admin/users', icon: UsersIcon, badge: false }
	];
</script>

<Sidebar variant="floating" collapsible="icon">
	<SidebarHeader>
		<SidebarHeader class="p-0">
			<a href="/admin" class="flex items-center gap-2">
				<img src={logo} alt={APP_NAME} class="h-8 w-auto" />
				{#if sidebar.open}
					<span class="text-lg font-semibold">{APP_NAME}</span>
				{/if}
			</a>
		</SidebarHeader>
	</SidebarHeader>

	<SidebarContent>
		<SidebarGroup>
			<SidebarGroupLabel>Navigation Menu</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu class="space-y-2">
					{#each SIDEBAR_ITEMS as item}
						{@const isActive = page.url.pathname === item.href}

						<SidebarMenuItem>
							<SidebarMenuButton {isActive}>
								{#snippet tooltipContent()}
									{item.title}
								{/snippet}
								{#snippet child({ props })}
									<a href={item.href} {...props}>
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
				<SidebarMenuButton isActive={page.url.pathname === '/admin/settings'}>
					{#snippet tooltipContent()}
						Settings
					{/snippet}
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
