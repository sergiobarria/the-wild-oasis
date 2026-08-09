import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

import type { ReservationSummary } from './reservation-row';
import { ReservationStatusBadge } from './reservation-status-badge';

export function UpcomingStayCard({ reservation }: { reservation: ReservationSummary }) {
    return (
        <Card>
            <CardContent className='flex gap-4'>
                {reservation.coverImageUrl && (
                    <div className='relative aspect-4/3 w-28 shrink-0 overflow-hidden rounded-lg'>
                        <Image
                            src={reservation.coverImageUrl}
                            alt=''
                            fill
                            className='object-cover'
                            sizes='112px'
                        />
                    </div>
                )}
                <div className='min-w-0 flex-1 space-y-2'>
                    <div className='flex items-start justify-between gap-2'>
                        <h3 className='font-heading text-base font-medium'>
                            {reservation.cabinName}
                        </h3>
                        <ReservationStatusBadge status={reservation.status} />
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        {reservation.checkIn} &rarr; {reservation.checkOut} &middot;{' '}
                        {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
