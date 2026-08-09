'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCents } from '@/lib/money';

import { CancelReservationAction } from './cancel-reservation-action';
import type { ReservationSummary } from './reservation-row';
import { ReservationStatusBadge } from './reservation-status-badge';

const PAYMENT_STATUS_LABELS: Record<ReservationSummary['paymentStatus'], string> = {
    not_required: 'Not required',
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
};

export function ReservationDetailDialog({
    reservation,
    onClose,
}: {
    reservation: ReservationSummary | null;
    onClose: () => void;
}) {
    return (
        <Dialog open={reservation !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className='sm:max-w-md'>
                {reservation && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Reservation details</DialogTitle>
                        </DialogHeader>

                        <div className='space-y-2 text-sm'>
                            <div className='flex justify-between'>
                                <span className='text-muted-foreground'>Reference</span>
                                <span className='font-medium'>{reservation._id}</span>
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
                                <span className='text-muted-foreground'>Payment status</span>
                                <span className='font-medium'>
                                    {PAYMENT_STATUS_LABELS[reservation.paymentStatus]}
                                </span>
                            </div>
                        </div>

                        <CancelReservationAction reservation={reservation} />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
