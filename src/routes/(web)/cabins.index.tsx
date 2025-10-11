import { Suspense } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { createStandardSchemaV1, parseAsString, useQueryStates } from 'nuqs'

import { Typography } from '@/components/shared/typography'
import { CabinList } from '@/features/cabins/components/cabin-list'
import { cabinQueries } from '@/features/cabins/queries'

const searchParams = {
    search: parseAsString.withDefault(''),
}

export const Route = createFileRoute('/(web)/cabins/')({
    validateSearch: createStandardSchemaV1(searchParams, {
        partialOutput: true,
    }),
    component: RouteComponent,
    loader: async ({ context }) => {
        context.queryClient.ensureQueryData(cabinQueries.list())
    },
})

function RouteComponent() {
    const [{ search }] = useQueryStates(searchParams)

    return (
        <section className="container mx-auto max-w-7xl px-8 py-12">
            <Typography variant="h1" size="3xl" className="text-primary">
                Our Luxury Cabins
            </Typography>
            <Typography variant="body">
                Cozy yet luxurious cabins, located right at the heart of the Italian Dolomites. Imagine waking up to
                beautiful mountain views, spending your days exploring the dark forests around, or just relaxing in your
                private hot tub under the stars. Enjoy nature's beauty in your own little home away from home. The
                perfect spot for a peaceful, calm vacation. Welcome to paradise.
            </Typography>

            <Suspense fallback={<div>Loading...</div>}>
                <CabinList searchQuery={search} />
            </Suspense>
        </section>
    )
}
