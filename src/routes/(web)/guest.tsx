import { createFileRoute, redirect } from '@tanstack/react-router'

import { ChevronRight, Clock, MapPin, User } from 'lucide-react'

import { SignOutButton } from '@/components/shared/sign-out-button'
import { Typography } from '@/components/shared/typography'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APP_NAME } from '@/config/constants'
import { bookingQueries } from '@/features/booking/queries'

export const Route = createFileRoute('/(web)/guest')({
    beforeLoad: async ({ context, location }) => {
        if (!context.session) {
            throw redirect({ to: '/sign-in', search: { redirect: location.href } })
        }
    },
    head: () => ({
        meta: [{ title: 'Guest Area | ' + APP_NAME }],
    }),
    component: RouteComponent,
    loader: async ({ context }) => {
        const userBookings = await context.queryClient.ensureQueryData(
            bookingQueries.userBookings(context.session!.userId),
        )

        return { userBookings }
    },
})

// Mock data
const MOCK_USER = {
    name: 'Maria García',
    email: 'maria.garcia@email.com',
    phone: '+507 6234-5678',
    initials: 'MG',
    memberSince: 'January 2024',
}

const MOCK_UPCOMING_BOOKINGS = [
    {
        id: '1',
        property: 'Sunset Beach House',
        location: 'Bocas del Toro',
        checkIn: 'Nov 20, 2025',
        checkOut: 'Nov 27, 2025',
        nights: 7,
        status: 'confirmed',
    },
    {
        id: '2',
        property: 'Mountain Retreat',
        location: 'Boquete',
        checkIn: 'Dec 15, 2025',
        checkOut: 'Dec 20, 2025',
        nights: 5,
        status: 'pending',
    },
]

const MOCK_PAST_BOOKINGS = [
    {
        id: '3',
        property: 'City Loft',
        location: 'Casco Viejo',
        date: 'Sep 2025',
    },
    {
        id: '4',
        property: 'Jungle Lodge',
        location: 'Gamboa',
        date: 'Jul 2025',
    },
    {
        id: '5',
        property: 'Beach Condo',
        location: 'Playa Blanca',
        date: 'May 2025',
    },
]

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        message: 'Your booking at Sunset Beach House was confirmed',
        time: '2 hours ago',
        unread: true,
    },
    {
        id: '2',
        message: 'Payment successful for Mountain Retreat',
        time: '1 day ago',
        unread: true,
    },
    {
        id: '3',
        message: 'New message from your host at Beach House',
        time: '3 days ago',
        unread: false,
    },
]

function RouteComponent() {
    const { userBookings } = Route.useLoaderData()
    const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length

    return (
        <div className="container mx-auto max-w-6xl px-5 py-12 md:px-0">
            {/* Welcome Header */}
            <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-xl font-semibold">{MOCK_USER.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <Typography as="h1" variant="h1" size="3xl" className="mb-1">
                            Hey, {MOCK_USER.name.split(' ')[0]} 👋
                        </Typography>
                        <Typography variant="muted" className="mb-0">
                            Welcome to your personal space
                        </Typography>
                    </div>
                </div>

                <SignOutButton variant="outline" withLabel size="lg" />
            </div>

            {/* Tabs Navigation */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="notifications" className="relative">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-destructive absolute -top-1 -right-1 h-2 w-2 rounded-full" />
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Upcoming Trip Highlight */}
                    {MOCK_UPCOMING_BOOKINGS.length > 0 && (
                        <div>
                            <Typography as="h2" variant="h2" size="lg" className="mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Next Trip
                            </Typography>

                            <Card>
                                <div className="bg-muted flex aspect-video items-center justify-center">
                                    <MapPin className="text-muted-foreground h-12 w-12" />
                                </div>
                                <CardContent className="p-6">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div>
                                            <Typography as="h3" variant="h3" size="xl" className="mb-1">
                                                {MOCK_UPCOMING_BOOKINGS[0].property}
                                            </Typography>
                                            <Typography variant="muted" className="mb-0 flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                {MOCK_UPCOMING_BOOKINGS[0].location}
                                            </Typography>
                                        </div>
                                        <Badge>{MOCK_UPCOMING_BOOKINGS[0].status}</Badge>
                                    </div>

                                    <div className="mb-6 flex flex-wrap gap-6 text-sm">
                                        <div>
                                            <Typography variant="muted" size="sm" className="mb-1">
                                                Check-in
                                            </Typography>
                                            <Typography size="sm" className="mb-0 font-medium">
                                                {MOCK_UPCOMING_BOOKINGS[0].checkIn}
                                            </Typography>
                                        </div>
                                        <Separator orientation="vertical" className="h-12" />
                                        <div>
                                            <Typography variant="muted" size="sm" className="mb-1">
                                                Check-out
                                            </Typography>
                                            <Typography size="sm" className="mb-0 font-medium">
                                                {MOCK_UPCOMING_BOOKINGS[0].checkOut}
                                            </Typography>
                                        </div>
                                        <Separator orientation="vertical" className="h-12" />
                                        <div>
                                            <Typography variant="muted" size="sm" className="mb-1">
                                                Duration
                                            </Typography>
                                            <Typography size="sm" className="mb-0 font-medium">
                                                {MOCK_UPCOMING_BOOKINGS[0].nights} nights
                                            </Typography>
                                        </div>
                                    </div>

                                    <Button className="w-full">
                                        View Details
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Typography variant="h2" size="3xl" className="mb-1">
                                    {MOCK_UPCOMING_BOOKINGS.length}
                                </Typography>
                                <Typography variant="muted" size="sm" className="mb-0">
                                    Upcoming
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Typography variant="h2" size="3xl" className="mb-1">
                                    {MOCK_PAST_BOOKINGS.length}
                                </Typography>
                                <Typography variant="muted" size="sm" className="mb-0">
                                    Completed
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Typography variant="h2" size="3xl" className="mb-1">
                                    {unreadCount}
                                </Typography>
                                <Typography variant="muted" size="sm" className="mb-0">
                                    New Updates
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="space-y-6">
                    <div>
                        <Typography as="h2" variant="h2" size="lg" className="mb-4">
                            Upcoming Bookings
                        </Typography>
                        <div className="space-y-3">
                            {MOCK_UPCOMING_BOOKINGS.map((booking) => (
                                <Card key={booking.id} className="hover:bg-accent cursor-pointer transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <Typography variant="h4" className="mb-0">
                                                        {booking.property}
                                                    </Typography>
                                                    <Badge
                                                        variant={
                                                            booking.status === 'confirmed' ? 'default' : 'secondary'
                                                        }
                                                    >
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <Typography
                                                    variant="muted"
                                                    size="sm"
                                                    className="mb-1 flex items-center gap-1.5"
                                                >
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {booking.location}
                                                </Typography>
                                                <Typography size="sm" className="mb-0">
                                                    {booking.checkIn} - {booking.checkOut} • {booking.nights} nights
                                                </Typography>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Typography as="h2" variant="h2" size="lg" className="mb-4">
                            Past Stays
                        </Typography>
                        <div className="space-y-3">
                            {MOCK_PAST_BOOKINGS.map((booking) => (
                                <Card key={booking.id} className="hover:bg-accent cursor-pointer transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Typography variant="h4" className="mb-1">
                                                    {booking.property}
                                                </Typography>
                                                <Typography
                                                    variant="muted"
                                                    size="sm"
                                                    className="mb-0 flex items-center gap-1.5"
                                                >
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {booking.location}
                                                </Typography>
                                            </div>
                                            <Typography variant="muted" size="sm" className="mb-0">
                                                {booking.date}
                                            </Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardContent className="space-y-4 p-6">
                            <div className="flex items-center gap-4 border-b pb-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="text-2xl">{MOCK_USER.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <Typography as="h3" variant="h3" size="xl" className="mb-1">
                                        {MOCK_USER.name}
                                    </Typography>
                                    <Typography variant="muted" size="sm" className="mb-0">
                                        Member since {MOCK_USER.memberSince}
                                    </Typography>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Typography variant="muted" size="sm" className="mb-1 font-medium">
                                        Email
                                    </Typography>
                                    <Typography className="mb-0">{MOCK_USER.email}</Typography>
                                </div>
                                <div>
                                    <Typography variant="muted" size="sm" className="mb-1 font-medium">
                                        Phone
                                    </Typography>
                                    <Typography className="mb-0">{MOCK_USER.phone}</Typography>
                                </div>
                            </div>

                            <Button className="w-full" variant="outline">
                                <User className="mr-2 h-4" />
                                Edit Profile
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-3">
                    {MOCK_NOTIFICATIONS.map((notification) => (
                        <Card key={notification.id} className="hover:bg-accent transition-colors">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        {notification.unread && <div className="bg-primary h-2 w-2 rounded-full" />}
                                    </div>
                                    <div className="flex-1">
                                        <Typography className={notification.unread ? 'mb-0 font-medium' : 'mb-0'}>
                                            {notification.message}
                                        </Typography>
                                        <Typography variant="muted" size="xs" className="mt-1 mb-0">
                                            {notification.time}
                                        </Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    )
}
