<script lang="ts">
	import { ensureAuthenticated } from '$lib/api/auth.remote';
	import SignOutButton from '$lib/components/auth/sign-out-button.svelte';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';

	const { user } = await ensureAuthenticated();

	const MOCK_UPCOMING_BOOKINGS = [
		{
			id: '1',
			property: 'Sunset Beach House',
			location: 'Bocas del Toro',
			checkIn: 'Nov 20, 2025',
			checkOut: 'Nov 27, 2025',
			nights: 7,
			status: 'confirmed'
		},
		{
			id: '2',
			property: 'Mountain Retreat',
			location: 'Boquete',
			checkIn: 'Dec 15, 2025',
			checkOut: 'Dec 20, 2025',
			nights: 5,
			status: 'pending'
		}
	];

	const MOCK_PAST_BOOKINGS = [
		{
			id: '3',
			property: 'City Loft',
			location: 'Casco Viejo',
			date: 'Sep 2025'
		},
		{
			id: '4',
			property: 'Jungle Lodge',
			location: 'Gamboa',
			date: 'Jul 2025'
		},
		{
			id: '5',
			property: 'Beach Condo',
			location: 'Playa Blanca',
			date: 'May 2025'
		}
	];

	const MOCK_NOTIFICATIONS = [
		{
			id: '1',
			message: 'Your booking at Sunset Beach House was confirmed',
			time: '2 hours ago',
			unread: true
		},
		{
			id: '2',
			message: 'Payment successful for Mountain Retreat',
			time: '1 day ago',
			unread: true
		},
		{
			id: '3',
			message: 'New message from your host at Beach House',
			time: '3 days ago',
			unread: false
		}
	];

	const unreadCount = $derived(MOCK_NOTIFICATIONS.filter((n) => n.unread).length);
	const initials = $derived.by(() => {
		let initials = user.email[0].toUpperCase();

		if (user.name)
			initials = user.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase();

		return initials;
	});

	const username = $derived.by(() => {
		return user.name ? user.name.split(' ')[0] : user.email.split('@')[0];
	});
</script>

<div class="container mx-auto max-w-6xl px-5 py-12 md:px-0">
	<!-- Welcome Header -->
	<div class="mb-8 flex items-start justify-between">
		<div class="flex items-center gap-4">
			<Avatar class="size-16">
				<AvatarFallback class="text-xl font-semibold">{initials}</AvatarFallback>
			</Avatar>
			<div>
				<Typography as="h1" variant="h1" size="3xl" class="mb-1">
					Hey, {username} 👋
				</Typography>
				<Typography variant="muted" class="mb-0">Welcome to your personal space</Typography>
			</div>
		</div>

		<SignOutButton variant="outline" withLabel size="lg" />
	</div>

	<!-- Tabs Navigation -->
	<Tabs value="overview" class="space-y-6">
		<TabsList>
			<TabsTrigger value="overview">Overview</TabsTrigger>
			<TabsTrigger value="bookings">My Bookings</TabsTrigger>
			<TabsTrigger value="profile">Profile</TabsTrigger>
			<TabsTrigger value="notifications">
				Notifications
				{#if unreadCount > 0}
					<span
						class="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-destructive px-2 text-xs font-semibold text-destructive-foreground"
					>
						{unreadCount}
					</span>
				{/if}
			</TabsTrigger>
		</TabsList>

		<!-- Overview Tab Content -->
		<TabsContent value="overview">
			<Typography variant="h2" class="mb-4">Overview</Typography>
			<Typography variant="body" class="mb-2">Welcome to your overview page!</Typography>
		</TabsContent>

		<!-- My Bookings Tab Content -->
		<TabsContent value="bookings">
			<Typography variant="h2" class="mb-4">My Bookings</Typography>

			<!-- Upcoming Bookings -->
			<div class="mb-8">
				<Typography variant="h3" class="mb-4">Upcoming Bookings</Typography>
				{#if MOCK_UPCOMING_BOOKINGS.length === 0}
					<Typography variant="muted">You have no upcoming bookings.</Typography>
				{:else}
					<ul class="space-y-4">
						{#each MOCK_UPCOMING_BOOKINGS as booking}
							<li class="rounded-lg border p-4">
								<Typography variant="body" class="font-semibold">
									{booking.property} - {booking.location}
								</Typography>
								<Typography variant="muted" class="text-sm">
									Check-in: {booking.checkIn} | Check-out: {booking.checkOut} | Nights: {booking.nights}
									| Status: {booking.status}
								</Typography>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<!-- Past Bookings -->
			<div>
				<Typography variant="h3" class="mb-4">Past Bookings</Typography>
				{#if MOCK_PAST_BOOKINGS.length === 0}
					<Typography variant="muted">You have no past bookings.</Typography>
				{:else}
					<ul class="space-y-4">
						{#each MOCK_PAST_BOOKINGS as booking}
							<li class="rounded-lg border p-4">
								<Typography variant="body" class="font-semibold">
									{booking.property} - {booking.location}
								</Typography>
								<Typography variant="muted" class="text-sm">Date: {booking.date}</Typography>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</TabsContent>

		<!-- Profile Tab Content -->
		<TabsContent value="profile">
			<Typography variant="h2" class="mb-4">Profile</Typography>
			<Typography variant="body" class="mb-2">Manage your profile information here.</Typography>
		</TabsContent>

		<!-- Notifications Tab Content -->
		<TabsContent value="notifications">
			<Typography variant="h2" class="mb-4">Notifications</Typography>
			{#if MOCK_NOTIFICATIONS.length === 0}
				<Typography variant="muted">You have no notifications.</Typography>
			{:else}
				<ul class="space-y-4">
					{#each MOCK_NOTIFICATIONS as notification}
						<li class="rounded-lg border p-4 {notification.unread ? 'bg-secondary/10' : ''}">
							<Typography variant="body" class="font-semibold">
								{notification.message}
							</Typography>
							<Typography variant="muted" class="text-sm">Received: {notification.time}</Typography>
						</li>
					{/each}
				</ul>
			{/if}
		</TabsContent>
	</Tabs>
</div>
