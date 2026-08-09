import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { CheckoutSuccessScreen } from '@/features/checkout/checkout-success-screen';
import { fetchAuthQuery } from '@/lib/auth-server';
import { firstSearchParam } from '@/lib/search-params';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Reservation confirmed'),
};

export default async function CheckoutSuccessPage({
    searchParams,
}: PageProps<'/checkout/success'>) {
    const params = await searchParams;
    const reservationId = firstSearchParam(params.reservationId);

    if (!reservationId) notFound();

    const reservation = await fetchAuthQuery(api.reservations.getOwnReservation, {
        reservationId,
    });

    if (!reservation) notFound();

    return <CheckoutSuccessScreen reservation={reservation} />;
}
