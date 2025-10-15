import { createFileRoute } from '@tanstack/react-router'

import { ArrowLeftIcon, CalendarIcon, MoonIcon, UsersIcon } from 'lucide-react'
import z from 'zod'

import { Typography } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
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
    component: RouteComponent,
    beforeLoad: async ({ context, search }) => {
        const cabin = await context.queryClient.ensureQueryData(cabinQueries.getById(search.cabinId))
        return { cabin }
    },
    errorComponent: (e) => <div>{e.error.message}</div>,
})

function RouteComponent() {
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

    const isAuthenticated = false

    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* Navigation */}
                <button
                    onClick={() => window.history.back()}
                    className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to cabin
                </button>

                {/* Main Grid */}
                <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <Typography variant="h1" className="mb-3 text-3xl font-bold lg:text-4xl">
                                Confirm your stay
                            </Typography>
                            <Typography className="text-muted-foreground text-lg">
                                Review the details below before completing your booking
                            </Typography>
                        </div>

                        {/* Cabin Card */}
                        <div className="bg-card group overflow-hidden rounded-xl border">
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                    src="/placeholder.jpg"
                                    alt={cabin.name}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {cabin.discountPercentage && cabin.discountPercentage > 0 && (
                                    <div className="absolute top-3 right-3 rounded-lg bg-green-600 px-3 py-1 text-sm font-semibold text-white">
                                        Save {cabin.discountPercentage}%
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <Typography variant="h2" className="mb-2 text-xl font-semibold">
                                    {cabin.name}
                                </Typography>
                                <Typography className="text-muted-foreground text-sm">{cabin.summary}</Typography>
                            </div>
                        </div>

                        {/* Trip Details */}
                        <div>
                            <Typography variant="h3" className="mb-4 text-lg font-semibold">
                                Trip details
                            </Typography>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-lg">
                                        <CalendarIcon className="text-primary size-5" />
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <div className="mb-1 flex items-baseline gap-3">
                                            <Typography className="font-medium">Check-in</Typography>
                                            <Typography className="text-muted-foreground text-sm">
                                                {formattedCheckinDate}
                                            </Typography>
                                        </div>
                                        <div className="flex items-baseline gap-3">
                                            <Typography className="font-medium">Check-out</Typography>
                                            <Typography className="text-muted-foreground text-sm">
                                                {formattedCheckoutDate}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-4">
                                    <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-lg">
                                        <MoonIcon className="text-primary size-5" />
                                    </div>
                                    <div className="flex-1">
                                        <Typography className="font-medium">{nights} nights</Typography>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-4">
                                    <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-lg">
                                        <UsersIcon className="text-primary size-5" />
                                    </div>
                                    <div className="flex-1">
                                        <Typography className="font-medium">
                                            {guests} {guests === 1 ? 'guest' : 'guests'}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Price Card (Sticky) */}
                    <div>
                        <div className="bg-card sticky top-8 rounded-xl border shadow-sm">
                            <div className="p-6">
                                <Typography variant="h3" className="mb-6 text-lg font-semibold">
                                    Price summary
                                </Typography>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            {formatPrice(cabin.pricePerNight)} × {nights}{' '}
                                            {nights === 1 ? 'night' : 'nights'}
                                        </span>
                                        <span>{formatPrice(priceBreakdown.basePrice)}</span>
                                    </div>

                                    {priceBreakdown.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>-{formatPrice(priceBreakdown.discount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cleaning fee</span>
                                        <span>{formatPrice(priceBreakdown.cleaningFee)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Service fee</span>
                                        <span>{formatPrice(priceBreakdown.serviceFee)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Booking fee</span>
                                        <span>{formatPrice(priceBreakdown.bookingFee)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Taxes</span>
                                        <span>{formatPrice(priceBreakdown.tax)}</span>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="mb-6 flex items-baseline justify-between">
                                    <Typography className="text-lg font-semibold">Total</Typography>
                                    <div className="text-right">
                                        <Typography className="text-2xl font-bold">
                                            {formatPrice(priceBreakdown.totalPrice)}
                                        </Typography>
                                        <Typography className="text-muted-foreground text-xs">USD</Typography>
                                    </div>
                                </div>

                                {isAuthenticated ? (
                                    <Button
                                        type="button"
                                        className="w-full"
                                        size="lg"
                                        onClick={() => console.log('Process payment')}
                                    >
                                        Confirm booking
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            type="button"
                                            className="w-full"
                                            size="lg"
                                            onClick={() => console.log('Navigate to login')}
                                        >
                                            Log in to book
                                        </Button>
                                        <Typography className="text-muted-foreground mt-3 text-center text-xs">
                                            You won't be charged yet
                                        </Typography>
                                    </>
                                )}
                            </div>

                            <div className="bg-muted/30 border-t px-6 py-4">
                                <Typography className="text-muted-foreground text-center text-xs">
                                    Free cancellation before check-in
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
