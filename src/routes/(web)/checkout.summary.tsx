import { createFileRoute } from '@tanstack/react-router'

import { ArrowLeftIcon, CalendarDaysIcon, InfoIcon, MoonIcon, UsersIcon } from 'lucide-react'
import z from 'zod'

import { Typography } from '@/components/shared/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { calculateNights } from '@/features/booking/calculations'
import { useBooking } from '@/features/booking/hooks/use-booking'
import { cabinQueries } from '@/features/cabins/queries'

const checkoutSearchSchema = z.object({
    cabinId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    guests: z.number(),
})

export const Route = createFileRoute('/(web)/checkout/summary')({
    validateSearch: checkoutSearchSchema,
    beforeLoad: async ({ context, search }) => {
        const cabin = await context.queryClient.ensureQueryData(cabinQueries.getById(search.cabinId))
        return { cabin }
    },
    component: RouteComponent,
    errorComponent: (e) => <div>{e.error.message}</div>,
})

function RouteComponent() {
    const { isAuthenticated } = Route.useRouteContext()
    const { checkIn, checkOut, guests } = Route.useSearch()
    const { cabin } = Route.useRouteContext()

    const { priceBreakdown, formatPrice, formattedCheckinDate, formattedCheckoutDate } = useBooking({
        range: { start: new Date(checkIn), end: new Date(checkOut) },
        guests,
        pricePerNight: cabin.pricePerNight,
    })
    const nights = calculateNights({ start: new Date(checkIn), end: new Date(checkOut) })

    if (!priceBreakdown || nights === 0) {
        return <div>Invalid booking</div>
    }

    return (
        <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-8">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to cabin
                </Button>

                <div className="mb-10">
                    <Typography variant="h2" className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Review your reservation
                    </Typography>
                    <Typography variant="body" className="text-muted-foreground text-lg">
                        One last look before you book
                    </Typography>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content - Takes 2 columns on large screens */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Cabin Preview */}
                        <Card className="overflow-hidden pt-0">
                            <div className="relative overflow-hidden">
                                <div className="aspect-video">
                                    <img
                                        src="/placeholder.jpg"
                                        alt={cabin.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                {cabin.discountPercentage && cabin.discountPercentage > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute top-4 right-4 bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Save {cabin.discountPercentage}%
                                    </Badge>
                                )}
                            </div>
                            <CardHeader className="space-y-1">
                                <CardTitle>
                                    <Typography variant="h3" size="2xl">
                                        {cabin.name}
                                    </Typography>
                                </CardTitle>
                                <Typography
                                    variant="body"
                                    size="lg"
                                    className="text-muted-foreground mb-1 leading-relaxed"
                                >
                                    {cabin.summary}
                                </Typography>
                                <Typography
                                    variant="body"
                                    size="lg"
                                    className="text-muted-foreground mb-1 leading-relaxed"
                                >
                                    {cabin.description}
                                </Typography>
                            </CardHeader>
                        </Card>

                        {/* Booking Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 font-medium">
                                            <CalendarDaysIcon className="text-primary size-5" />
                                            <span>Check-in</span>
                                        </div>
                                        <Typography variant="body" className="text-muted-foreground pl-7">
                                            {formattedCheckinDate}
                                        </Typography>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 font-medium">
                                            <CalendarDaysIcon className="text-primary size-5" />
                                            <span>Check-out</span>
                                        </div>
                                        <Typography variant="body" className="text-muted-foreground pl-7">
                                            {formattedCheckoutDate}
                                        </Typography>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-medium">
                                        <MoonIcon className="text-primary size-5" />
                                        <span>Duration</span>
                                    </div>
                                    <Typography variant="body" className="text-muted-foreground">
                                        {nights} {nights === 1 ? 'night' : 'nights'}
                                    </Typography>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-medium">
                                        <UsersIcon className="text-primary size-5" />
                                        <span>Guests</span>
                                    </div>
                                    <Typography variant="body" className="text-muted-foreground">
                                        {guests} {guests === 1 ? 'guest' : 'guests'}
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Price Summary - Takes 1 column, sticky on large screens */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Price summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {formatPrice(cabin.pricePerNight)} × {nights}{' '}
                                            {nights === 1 ? 'night' : 'nights'}
                                        </span>
                                        <span className="font-medium">{formatPrice(priceBreakdown.basePrice)}</span>
                                    </div>

                                    {priceBreakdown.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600 dark:text-green-400">Discount</span>
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                -{formatPrice(priceBreakdown.discount)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Cleaning fee</span>
                                        <span className="font-medium">{formatPrice(priceBreakdown.cleaningFee)}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Service fee</span>
                                        <span className="font-medium">{formatPrice(priceBreakdown.serviceFee)}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Booking fee</span>
                                        <span className="font-medium">{formatPrice(priceBreakdown.bookingFee)}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Taxes</span>
                                        <span className="font-medium">{formatPrice(priceBreakdown.tax)}</span>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex items-baseline justify-between pt-2">
                                        <span className="text-lg font-semibold">Total</span>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold">
                                                {formatPrice(priceBreakdown.totalPrice)}
                                            </div>
                                            <div className="text-muted-foreground text-xs">USD</div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col gap-3 pt-6">
                                    {isAuthenticated ? (
                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={() => console.log('Process payment')}
                                        >
                                            Confirm booking
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                className="w-full"
                                                size="lg"
                                                onClick={() => console.log('Navigate to login')}
                                            >
                                                Log in to book
                                            </Button>
                                            <Typography
                                                variant="body"
                                                size="xs"
                                                className="text-muted-foreground text-center"
                                            >
                                                You won't be charged yet
                                            </Typography>
                                        </>
                                    )}

                                    <div className="flex w-full items-start gap-2 rounded-lg border p-3">
                                        <InfoIcon className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                                        <Typography
                                            variant="body"
                                            size="xs"
                                            className="text-muted-foreground leading-relaxed"
                                        >
                                            Free cancellation available before check-in
                                        </Typography>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
