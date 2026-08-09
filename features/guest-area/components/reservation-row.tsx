import type { FunctionReturnType } from 'convex/server';

import type { api } from '@/convex/_generated/api';
import { formatCents } from '@/lib/money';

import { paymentStatusLabel } from './payment-status-label';
import { ReservationStatusBadge } from './reservation-status-badge';

export type ReservationSummary = FunctionReturnType<
    typeof api.reservations.listOwnReservations
>[number];

export function ReservationRow({
    reservation,
    onOpen,
}: {
    reservation: ReservationSummary;
    onOpen: () => void;
}) {
    return (
        <button
            type='button'
            onClick={onOpen}
            className='w-full rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary/50'
        >
            <div className='flex items-center justify-between gap-4'>
                <div className='min-w-0 space-y-1'>
                    <p className='truncate font-medium'>{reservation.cabinName}</p>
                    <p className='text-sm text-muted-foreground'>
                        {reservation.checkIn} &rarr; {reservation.checkOut} &middot;{' '}
                        {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
                    </p>
                </div>
                <div className='flex shrink-0 flex-col items-end gap-1.5'>
                    <ReservationStatusBadge status={reservation.status} />
                    <span className='text-sm font-medium'>
                        {formatCents(reservation.pricing.total)}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                        Payment: {paymentStatusLabel(reservation.paymentStatus)}
                    </span>
                </div>
            </div>
        </button>
    );
}
