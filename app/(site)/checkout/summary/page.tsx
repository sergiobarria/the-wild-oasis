import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import type { Id } from '@/convex/_generated/dataModel';
import { loadCheckoutSummaryData } from '@/features/checkout/checkout-api';
import { CheckoutSummaryScreen } from '@/features/checkout/checkout-summary-screen';
import { todayIsoDate } from '@/lib/dates';
import { APP_ROUTES } from '@/lib/routes';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Checkout'),
};

export default async function CheckoutSummaryPage({
    searchParams,
}: PageProps<'/checkout/summary'>) {
    const params = await searchParams;
    const cabinId = firstValue(params.cabinId);
    const checkIn = firstValue(params.checkIn);
    const checkOut = firstValue(params.checkOut);
    const guests = Number(firstValue(params.guests));

    if (!cabinId || !checkIn || !checkOut || !Number.isInteger(guests) || guests < 1) {
        redirect(APP_ROUTES.CABINS);
    }

    const data = await loadCheckoutSummaryData({
        cabinId: cabinId as Id<'cabins'>,
        checkIn,
        checkOut,
        guests,
        now: todayIsoDate(),
    });

    return (
        <CheckoutSummaryScreen
            cabin={data.cabin}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            availability={data.availability}
            stripePaymentsEnabled={data.stripePaymentsEnabled}
            guestName={data.user?.name ?? ''}
            guestEmail={data.user?.email ?? ''}
        />
    );
}

function firstValue(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}
