/**
 * Seeds realistic guest reviews for the cabins already seeded by `seed-cabins.ts`, adapted from
 * `data/data-reviews.ts` (reference/legacy only, not a strict source of truth -- expanded here to
 * cover every cabin in the current catalog). Run `bun run seed:cabins` first.
 *
 * Reviews aren't backed by real, sign-in-able accounts (see `reviews` table's doc comment in
 * convex/schema.ts) -- `userId` is a synthetic string paired with a denormalized author name.
 *
 * Talks to Convex via `bunx convex run`, same reasoning as `seed-cabins.ts`.
 *
 * Usage: `bun run seed:reviews`
 */
import { execFileSync } from 'node:child_process';

function runConvex(fn: string, args: unknown = {}): unknown {
    const output = execFileSync('bunx', ['convex', 'run', fn, JSON.stringify(args)], {
        encoding: 'utf-8',
    });
    // A function returning `null` (e.g. seedReviews) prints nothing at all, not "null".
    return output.trim() ? JSON.parse(output) : null;
}

type ReviewSeed = {
    userId: string;
    authorName: string;
    rating: number;
    comment: string;
    createdAt: string;
};

const REVIEWS_BY_SLUG: Record<string, ReviewSeed[]> = {
    'mountain-view-retreat': [
        {
            userId: 'seed-guest-1',
            authorName: 'Sarah Mitchell',
            rating: 5,
            comment:
                "Absolutely stunning! The views were even better than the photos. The cabin was spotless and had everything we needed. Can't wait to return!",
            createdAt: '2025-06-15T14:30:00Z',
        },
        {
            userId: 'seed-guest-2',
            authorName: 'Marco Rossi',
            rating: 4,
            comment:
                'Great location and amenities. Only minor issue was the WiFi could be faster, but honestly, it was nice to disconnect a bit!',
            createdAt: '2025-07-02T11:20:00Z',
        },
    ],
    'cozy-forest-cabin': [
        {
            userId: 'seed-guest-3',
            authorName: 'Emma Johnson',
            rating: 5,
            comment:
                'Perfect romantic getaway! The hot tub under the stars was magical. Very private and peaceful. Highly recommend for couples.',
            createdAt: '2025-05-20T16:45:00Z',
        },
        {
            userId: 'seed-guest-4',
            authorName: 'Priya Nair',
            rating: 5,
            comment:
                "Cozy is right -- the wood-burning stove made the whole place feel like a postcard. We didn't want to leave.",
            createdAt: '2025-08-01T09:10:00Z',
        },
    ],
    'lakeside-family-lodge': [
        {
            userId: 'seed-guest-5',
            authorName: 'David Chen',
            rating: 5,
            comment:
                'Our family had an amazing week here! The kids loved the lake and the game room kept them entertained on rainy days. Plenty of space for everyone.',
            createdAt: '2025-06-28T09:15:00Z',
        },
        {
            userId: 'seed-guest-6',
            authorName: 'Julia Schmidt',
            rating: 4,
            comment:
                'Beautiful property with excellent facilities. The kayaks were a nice touch. Would have been 5 stars if checkout time was a bit later.',
            createdAt: '2025-07-15T13:00:00Z',
        },
    ],
    'alpine-luxury-suite': [
        {
            userId: 'seed-guest-7',
            authorName: 'Alessandro Bianchi',
            rating: 5,
            comment:
                "Pure luxury! The sauna and jacuzzi were incredible after long days of hiking. Kitchen was a chef's dream. Worth every penny.",
            createdAt: '2025-07-22T18:30:00Z',
        },
        {
            userId: 'seed-guest-8',
            authorName: 'Hana Kobayashi',
            rating: 5,
            comment:
                "Every detail felt considered, from the heated floors to the wine cellar. Best anniversary trip we've had.",
            createdAt: '2025-08-05T20:00:00Z',
        },
    ],
    'rustic-mountain-hideaway': [
        {
            userId: 'seed-guest-9',
            authorName: 'Sophie Dubois',
            rating: 4,
            comment:
                'Great value for money! Basic but clean and comfortable. Perfect base for exploring the mountains. The host was very responsive and helpful.',
            createdAt: '2025-06-10T10:45:00Z',
        },
        {
            userId: 'seed-guest-10',
            authorName: 'Thomas Anderson',
            rating: 5,
            comment:
                'Loved the authentic mountain experience! Simple living at its best. The trails nearby are incredible. Already planning our next trip.',
            createdAt: '2025-05-08T15:20:00Z',
        },
    ],
    'sunset-valley-cottage': [
        {
            userId: 'seed-guest-11',
            authorName: 'Maria Garcia',
            rating: 5,
            comment:
                'The sunset views from the terrace are absolutely breathtaking! The herb garden was a lovely touch -- we used fresh basil for our dinners.',
            createdAt: '2025-07-28T12:10:00Z',
        },
        {
            userId: 'seed-guest-12',
            authorName: 'Oliver Brown',
            rating: 4,
            comment:
                'Charming cottage in a peaceful location. Great for families. The outdoor dining area was our favorite spot. Minor issue with hot water but was fixed quickly.',
            createdAt: '2025-08-03T14:55:00Z',
        },
    ],
    'hidden-creek': [
        {
            userId: 'seed-guest-13',
            authorName: 'Noah Williams',
            rating: 5,
            comment:
                'Falling asleep to the sound of the creek was exactly what we needed. The outdoor shower is such a nice touch on a warm evening.',
            createdAt: '2025-06-19T08:40:00Z',
        },
        {
            userId: 'seed-guest-14',
            authorName: 'Lena Fischer',
            rating: 4,
            comment:
                'Secluded and quiet, just as advertised. We brought our dog and the pet-friendly setup made it easy. Would come back in a heartbeat.',
            createdAt: '2025-07-11T17:25:00Z',
        },
    ],
    blackwood: [
        {
            userId: 'seed-guest-15',
            authorName: 'Carlos Mendoza',
            rating: 5,
            comment:
                'Booked this for a group trip with friends -- plenty of room to spread out and the board games came in handy on a rainy afternoon.',
            createdAt: '2025-08-09T19:05:00Z',
        },
        {
            userId: 'seed-guest-16',
            authorName: 'Aisha Rahman',
            rating: 4,
            comment:
                'Well-equipped kitchen made cooking for eight people painless. The grill outside was a nice bonus for evening cookouts.',
            createdAt: '2025-07-04T13:35:00Z',
        },
    ],
};

async function main() {
    let seededCabinCount = 0;

    for (const [slug, reviews] of Object.entries(REVIEWS_BY_SLUG)) {
        const cabin = runConvex('cabins:getBySlug', { slug }) as { _id: string } | null;

        if (!cabin) {
            console.log(
                `  skipped "${slug}" -- not seeded yet, run \`bun run seed:cabins\` first.`,
            );
            continue;
        }

        runConvex('reviews:seedReviews', {
            cabinId: cabin._id,
            reviews: reviews.map((review) => ({
                ...review,
                createdAt: Date.parse(review.createdAt),
            })),
        });
        seededCabinCount += 1;
        console.log(`  seeded ${reviews.length} review(s) for "${slug}"`);
    }

    console.log(`Done -- reviews synced for ${seededCabinCount} cabin(s).`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
