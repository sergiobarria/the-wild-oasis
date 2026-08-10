import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReservationStatus } from '@/convex/lib/reservations';
import { ReservationStatusBadge } from '@/features/guest-area/components/reservation-status-badge';
import { formatCents } from '@/lib/money';

type RecentBooking = {
    _id: string;
    cabinName: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    status: ReservationStatus;
    total: number;
};

export function RecentBookingsList({ bookings }: { bookings: RecentBooking[] }) {
    if (bookings.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className='text-base'>Recent bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>No bookings yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-base'>Recent bookings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                {bookings.map((booking) => (
                    <div
                        key={booking._id}
                        className='flex items-center justify-between gap-4 text-sm'
                    >
                        <div className='min-w-0'>
                            <p className='truncate font-medium'>{booking.guestName}</p>
                            <p className='truncate text-muted-foreground'>
                                {booking.cabinName} · {booking.checkIn} – {booking.checkOut}
                            </p>
                        </div>
                        <div className='flex shrink-0 items-center gap-3'>
                            <span className='font-medium'>{formatCents(booking.total)}</span>
                            <ReservationStatusBadge status={booking.status} />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
