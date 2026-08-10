'use client';

import { useQuery } from 'convex/react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { paymentStatusLabel } from '@/features/guest-area/components/payment-status-label';
import { ReservationStatusBadge } from '@/features/guest-area/components/reservation-status-badge';
import { formatCents } from '@/lib/money';

import { CancelBookingAction } from './cancel-booking-action';

export function BookingDetailDialog({
    reservationId,
    onClose,
}: {
    reservationId: string | null;
    onClose: () => void;
}) {
    // Treat an empty string the same as absent -- a hand-edited `?reservationId=` URL is a
    // real possibility (same normalize-then-skip discipline as the guest-side dialog's id).
    const isOpen = Boolean(reservationId);

    // `skip` when there's no id to look up -- an unauthenticated/closed state shouldn't fire a
    // query at all, matching the guest-side dialog's "render nothing" behavior for `null`.
    const reservation = useQuery(
        api.reservations.adminGetReservation,
        isOpen ? { reservationId: reservationId as string } : 'skip',
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className='sm:max-w-md'>
                {isOpen && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Booking details</DialogTitle>
                        </DialogHeader>

                        {reservation === undefined && (
                            <div className='space-y-2'>
                                {Array.from({ length: 6 }, (_, index) => (
                                    <Skeleton key={index} className='h-5 w-full' />
                                ))}
                            </div>
                        )}

                        {reservation === null && (
                            <p className='text-sm text-muted-foreground'>
                                This reservation could not be found.
                            </p>
                        )}

                        {reservation && (
                            <>
                                <div className='space-y-2 text-sm'>
                                    <div className='flex justify-between'>
                                        <span className='text-muted-foreground'>Reference</span>
                                        <span className='font-medium'>{reservation._id}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-muted-foreground'>Guest</span>
                                        <span className='font-medium'>
                                            {reservation.guestName} ({reservation.guestEmail})
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-muted-foreground'>Cabin</span>
                                        <span className='font-medium'>{reservation.cabinName}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-muted-foreground'>Dates</span>
                                        <span className='font-medium'>
                                            {reservation.checkIn} &rarr; {reservation.checkOut}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-muted-foreground'>Guests</span>
                                        <span className='font-medium'>{reservation.guests}</span>
                                    </div>
                                    <div className='flex justify-between border-t border-border pt-2'>
                                        <span className='text-muted-foreground'>Total</span>
                                        <span className='font-medium'>
                                            {formatCents(reservation.pricing.total)}
                                        </span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-muted-foreground'>Status</span>
                                        <ReservationStatusBadge status={reservation.status} />
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-muted-foreground'>
                                            Payment status
                                        </span>
                                        <span className='font-medium'>
                                            {paymentStatusLabel(reservation.paymentStatus)}
                                        </span>
                                    </div>
                                </div>

                                <CancelBookingAction
                                    reservationId={reservation._id}
                                    status={reservation.status}
                                />
                            </>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
