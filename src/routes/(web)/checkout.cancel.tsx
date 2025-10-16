import { Link, createFileRoute } from '@tanstack/react-router'

import { XCircleIcon } from 'lucide-react'

import { Typography } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/(web)/checkout/cancel')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex items-center justify-center px-4 py-16">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                        <XCircleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-2xl">Booking Cancelled</CardTitle>
                </CardHeader>

                <CardContent className="text-center">
                    <Typography variant="body" className="text-muted-foreground mb-4">
                        Your booking was cancelled and no charges were made.
                    </Typography>
                    <Typography variant="body" className="text-muted-foreground text-sm">
                        If you encountered any issues during checkout, please don't hesitate to contact our support
                        team.
                    </Typography>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    <Button asChild className="w-full">
                        <Link to="/">Browse Cabins</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link to="/contact">Contact Support</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
