import { eq, ne } from 'drizzle-orm'

import { db } from '@/database'
import { cabins } from '@/database/schemas'

export const getCabins = async () => {
    const cabins = await db.query.cabins.findMany()

    return cabins
}

export const getCabin = async (slug: string) => {
    const cabin = await db.query.cabins.findFirst({
        where: eq(cabins.slug, slug),
        with: {
            amenities: {
                columns: {
                    amenityId: false,
                    cabinId: false,
                },
                with: {
                    amenity: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
            reviews: true,
        },
    })

    const relatedCabins = await db.query.cabins.findMany({
        where: ne(cabins.slug, slug),
        limit: 3,
    })

    return {
        ...cabin,
        amenities: cabin?.amenities.map((amenity) => amenity.amenity.name),
        relatedCabins,
    }
}
