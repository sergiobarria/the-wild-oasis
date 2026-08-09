import type { Metadata } from 'next';

import { CheckoutCancelScreen } from '@/features/checkout/checkout-cancel-screen';
import { APP_ROUTES } from '@/lib/routes';
import { firstSearchParam } from '@/lib/search-params';
import { pageTitle } from '@/lib/site-config';

export const metadata: Metadata = {
    title: pageTitle('Checkout cancelled'),
};

export default async function CheckoutCancelPage({ searchParams }: PageProps<'/checkout/cancel'>) {
    const params = await searchParams;
    const cabinSlug = firstSearchParam(params.cabinSlug);

    return (
        <CheckoutCancelScreen cabinHref={cabinSlug ? APP_ROUTES.cabinDetails(cabinSlug) : null} />
    );
}
