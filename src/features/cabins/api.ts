import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { and, desc, eq, like, ne, sql } from 'drizzle-orm'
import z from 'zod'

import { db } from '@/database'
import { cabins } from '@/database/schemas'

export const getCabinsFn = createServerFn({ method: 'GET' })
    .inputValidator(z.object({ searchQuery: z.string().optional() }))
    .handler(async ({ data }) => {
        const conditions = []

        if (data.searchQuery) {
            conditions.push(like(sql`lower(${cabins.name})`, `%${data.searchQuery.toLowerCase()}%`))
        }

        const result = await db.query.cabins.findMany({
            where: and(...conditions),
            orderBy: [desc(cabins.createdAt)],
        })

        return result
    })

export const getCabinBySlugFn = createServerFn({ method: 'GET' })
    .inputValidator(z.object({ slug: z.string() }))
    .handler(async ({ data }) => {
        const cabin = await db.query.cabins.findFirst({
            where: eq(cabins.slug, data.slug),
            with: { reviews: true },
        })
        if (!cabin) throw notFound()

        const amenities = await db.query.amenities.findMany({ limit: Math.floor(Math.random() * 5) + 5 })
        const recommended = await db.query.cabins.findMany({
            where: ne(cabins.slug, data.slug),
            orderBy: [desc(cabins.createdAt)],
            limit: 3,
        })

        return {
            cabin,
            amenities,
            recommended,
        }
    })
