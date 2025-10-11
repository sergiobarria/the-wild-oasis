import { createServerFn } from '@tanstack/react-start'

import z from 'zod'

import { getCabin, getCabins } from '@/database/data-access/cabins'

export const getCabinsFn = createServerFn({ method: 'GET' }).handler(async () => {
    const cabins = await getCabins()

    return cabins
})

export const getCabinBySlugFn = createServerFn({ method: 'GET' })
    .inputValidator(z.object({ slug: z.string() }))
    .handler(async ({ data }) => {
        const cabin = await getCabin(data.slug)

        return cabin
    })
