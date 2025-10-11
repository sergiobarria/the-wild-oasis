import { createClient } from '@libsql/client'
import { createId } from '@paralleldrive/cuid2'
import { amenities } from 'data/data-amenities'
import { cabins } from 'data/data-cabins'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/libsql'

import * as schema from '@/database/schemas'

dotenv.config()

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set')
if (!DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set')

function getClient() {
    const client = createClient({
        url: DATABASE_URL as string,
        authToken: DATABASE_AUTH_TOKEN as string,
    })

    return drizzle(client, { schema })
}

async function seedCabins() {
    console.log('🌱 Seeding cabins...')

    const db = getClient()

    const [user] = await db
        .insert(schema.users)
        .values({
            id: createId(),
            email: 'john@email.com',
            name: 'john',
        })
        .returning({ id: schema.users.id })

    for (const cabin of cabins) {
        const [inserted] = await db
            .insert(schema.cabins)
            .values({
                name: cabin.name,
                slug: cabin.slug,
                pricePerNight: cabin.price_per_night,
                discountPercentage: cabin.discount_percentage,
                summary: cabin.summary,
                maxGuests: cabin.max_guests,
                beds: cabin.beds,
                baths: cabin.baths,
                description: cabin.description,
            })
            .returning({ id: schema.cabins.id })

        // ====== Seed a random number of amenities ======
        const amenitiesIds = await db.query.amenities.findMany({
            columns: { id: true },
        })

        const min = 3
        const max = Math.min(10, amenitiesIds.length)
        const randomCount = Math.floor(Math.random() * (max - min + 1)) + min

        const randomAmenities = amenitiesIds.sort(() => Math.random() - 0.5).slice(0, randomCount)

        await db.insert(schema.cabinsToAmenities).values(
            randomAmenities.map((amenity) => ({
                cabinId: inserted.id,
                amenityId: amenity.id,
            })),
        )

        // ====== Seed a random number of reviews ======
        const reviewsCount = Math.floor(Math.random() * 5) + 1

        for (let i = 0; i < reviewsCount; i++) {
            await db.insert(schema.reviews).values({
                cabin_id: inserted.id,
                user_id: user.id,
                rating: Math.floor(Math.random() * 5) + 1,
                comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                author_name: 'John Doe',
            })
        }

        console.log(`Seeded cabin ${inserted.id} with ${reviewsCount} reviews`)
    }
}

async function seedAmenities() {
    console.log('🌱 Seeding amenities...')

    const db = getClient()

    for (const amenity of amenities) {
        await db.insert(schema.amenities).values({
            name: amenity.name,
            group: amenity.group,
        })
    }
}

async function seed() {
    console.log('🌱 Seeding database...')
    console.log('🗑️ Clearing database...')
    const db = getClient()

    await db.delete(schema.users)
    await db.delete(schema.cabins)
    await db.delete(schema.amenities)

    // ======== SEEDING ========
    await seedAmenities()
    await seedCabins()
}

seed()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(() => {
        console.log('🌱 Database seeded successfully!')
        process.exit(0)
    })
