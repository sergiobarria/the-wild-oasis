'use client';

import type { FunctionReturnType } from 'convex/server';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { api } from '@/convex/_generated/api';
import { paymentStatusLabel } from '@/features/guest-area/components/payment-status-label';
import { ReservationStatusBadge } from '@/features/guest-area/components/reservation-status-badge';
import { formatCents } from '@/lib/money';

export type AdminBookingRow = FunctionReturnType<
    typeof api.reservations.adminListReservations
>[number];

export function BookingsTable({
    bookings,
    onOpen,
}: {
    bookings: AdminBookingRow[];
    onOpen: (reservationId: string) => void;
}) {
    if (bookings.length === 0) {
        return <p className='text-sm text-muted-foreground'>No bookings match these filters.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Cabin</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.map((booking) => (
                    <TableRow
                        key={booking._id}
                        onClick={() => onOpen(booking._id)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                onOpen(booking._id);
                            }
                        }}
                        role='button'
                        tabIndex={0}
                        className='cursor-pointer'
                    >
                        <TableCell>
                            <div>
                                <p className='font-medium'>{booking.guestName}</p>
                                <p className='text-xs text-muted-foreground'>
                                    {booking.guestEmail}
                                </p>
                            </div>
                        </TableCell>
                        <TableCell>{booking.cabinName}</TableCell>
                        <TableCell>
                            {booking.checkIn} &rarr; {booking.checkOut}
                        </TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell>
                            <ReservationStatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell>{paymentStatusLabel(booking.paymentStatus)}</TableCell>
                        <TableCell>{formatCents(booking.total)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
