import { Link, createFileRoute } from '@tanstack/react-router'

import { CheckCircle2Icon } from 'lucide-react'

import { Typography } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const MOCK_BOOKING = {
    nights: 3,
    totalPrice: 120,
}

export const Route = createFileRoute('/(web)/checkout/success')({
    component: RouteComponent,
})

function RouteComponent() {
    if (!MOCK_BOOKING) {
        return (
            <div className="flex items-center justify-center py-12">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Booking Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Typography variant="body">We couldn't find your booking. Please contact support.</Typography>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link to="/">Return Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle2Icon className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
                    <Typography variant="body" className="text-muted-foreground text-lg">
                        Your reservation has been successfully confirmed
                    </Typography>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-muted/50 rounded-lg border p-6">
                        <Typography variant="h4" className="mb-4 text-xl font-semibold">
                            Reservation Details
                        </Typography>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nights</span>
                                <span className="font-medium">
                                    {MOCK_BOOKING.nights} {MOCK_BOOKING.nights === 1 ? 'night' : 'nights'}
                                </span>
                            </div>

                            <div className="my-4 border-t" />

                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total Paid</span>
                                <span>${MOCK_BOOKING.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                        <Typography variant="body" size="sm" className="text-blue-900 dark:text-blue-100">
                            A confirmation email has been sent to your email address with all the details of your
                            reservation.
                        </Typography>
                    </div>
                </CardContent>

                <CardFooter className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1">
                        <Link to="/">Return Home</Link>
                    </Button>
                    <Button asChild className="flex-1">
                        <Link to="/guest">View My Bookings</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
