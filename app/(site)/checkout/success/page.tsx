import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { preloadedQueryResult } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { CheckoutSuccessScreen } from '@/features/checkout/checkout-success-screen';
import { preloadAuthQuery } from '@/lib/auth-server';
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

    // Preloaded (not a one-shot fetch): a Stripe-paid reservation can land here still
    // `pending`, only flipping to `confirmed`/`paid` once the webhook arrives -- the client
    // component below stays subscribed via `usePreloadedQuery` so that update renders live,
    // with no polling.
    const preloadedReservation = await preloadAuthQuery(api.reservations.getOwnReservation, {
        reservationId,
    });

    if (!preloadedQueryResult(preloadedReservation)) notFound();

    return <CheckoutSuccessScreen preloadedReservation={preloadedReservation} />;
}
