/**
 * Seeds the local dev deployment with real cabin photos + realistic cabin
 * data, adapted from `data/data-cabins.ts` (reference/legacy only, not a
 * strict source of truth -- expanded here for a fuller demo catalog).
 *
 * Talks to Convex via `bunx convex run`, not `ConvexHttpClient`: the client
 * can only reach internal mutations via `setAdminAuth()`, an `@internal` API
 * requiring a manually-sourced deploy key. The CLI already resolves auth from
 * the developer's local session, matching how this repo runs every other
 * one-off dev command (e.g. `bun run auth:generate && bunx convex dev --once`).
 *
 * Usage: `bun run seed:cabins`
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const IMAGE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'cabins');
const CENTS_PER_DOLLAR = 100;

function runConvex(fn: string, args: unknown = {}): unknown {
    const output = execFileSync('bunx', ['convex', 'run', fn, JSON.stringify(args)], {
        encoding: 'utf-8',
    });
    return JSON.parse(output);
}

async function uploadImage(fileName: string): Promise<string> {
    const uploadUrl = runConvex('cabins:generateUploadUrl') as string;
    const bytes = readFileSync(path.join(IMAGE_DIR, fileName));

    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: new Uint8Array(bytes),
    });

    if (!response.ok) {
        throw new Error(`Upload of ${fileName} failed: ${response.status} ${response.statusText}`);
    }

    const { storageId } = (await response.json()) as { storageId: string };
    return storageId;
}

/** ~15% of the nightly rate, rounded to the nearest $5. */
function cleaningFeeFor(nightlyRateCents: number): number {
    return Math.round((nightlyRateCents * 0.15) / 500) * 500;
}

type CabinSeed = {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    location: string;
    nightlyRateDollars: number;
    maxGuests: number;
    beds: number;
    bathrooms: number;
    createdAt: string;
    updatedAt: string;
    image: string;
    amenityNames: string[];
    /** Curated pick for the home page's Featured Cabins section. */
    featured: boolean;
};

const CABINS: CabinSeed[] = [
    {
        name: 'Mountain View Retreat',
        slug: 'mountain-view-retreat',
        shortDescription: 'Spacious cabin with breathtaking mountain views and modern amenities.',
        description:
            'Nestled in the heart of the Dolomites, this stunning cabin offers panoramic views of the surrounding peaks. Features include a fully equipped kitchen, cozy fireplace, and a private balcony perfect for morning coffee.',
        location: 'Dolomite Ridge',
        nightlyRateDollars: 250,
        maxGuests: 6,
        beds: 3,
        bathrooms: 2,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-10-01T14:20:00Z',
        image: 'cabin-001.jpg',
        amenityNames: ['WiFi', 'Kitchen', 'Fireplace', 'Workspace', 'Parking', 'Garden'],
        featured: true,
    },
    {
        name: 'Cozy Forest Cabin',
        slug: 'cozy-forest-cabin',
        shortDescription: 'Intimate woodland escape perfect for couples.',
        description:
            'A romantic getaway surrounded by pine trees. This charming cabin features rustic decor, a wood-burning stove, and a private hot tub under the stars.',
        location: 'Pinewood Hollow',
        nightlyRateDollars: 180,
        maxGuests: 2,
        beds: 1,
        bathrooms: 1,
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-09-28T16:45:00Z',
        image: 'cabin-002.jpg',
        amenityNames: ['WiFi', 'Fireplace', 'Hot Tub', 'Coffee Maker', 'Garden'],
        featured: true,
    },
    {
        name: 'Lakeside Family Lodge',
        slug: 'lakeside-family-lodge',
        shortDescription: 'Large family-friendly cabin by the lake with private dock.',
        description:
            'Perfect for family gatherings. This spacious lodge offers direct lake access, a game room, an expansive deck, and stunning sunset views. Kayaks and paddleboards included.',
        location: 'Silver Lake',
        nightlyRateDollars: 320,
        maxGuests: 8,
        beds: 4,
        bathrooms: 3,
        createdAt: '2024-02-10T11:00:00Z',
        updatedAt: '2024-10-05T12:30:00Z',
        image: 'cabin-003.jpg',
        amenityNames: [
            'WiFi',
            'Kitchen',
            'TV / Streaming',
            'Board Games',
            'Grill / BBQ',
            'Garden',
            'Crib',
            'Pet Friendly',
        ],
        featured: true,
    },
    {
        name: 'Alpine Luxury Suite',
        slug: 'alpine-luxury-suite',
        shortDescription: 'Premium cabin with spa facilities and a gourmet kitchen.',
        description:
            "Experience ultimate luxury in the mountains. Features include a private sauna, jacuzzi, chef's kitchen with wine cellar, heated floors, and designer furnishings throughout.",
        location: 'Frostpeak Summit',
        nightlyRateDollars: 450,
        maxGuests: 4,
        beds: 2,
        bathrooms: 2,
        createdAt: '2024-03-01T08:45:00Z',
        updatedAt: '2024-10-08T10:15:00Z',
        image: 'cabin-004.jpg',
        amenityNames: [
            'WiFi',
            'Kitchen',
            'Hot Tub',
            'Fireplace',
            'Gym',
            'Workspace',
            'Coffee Maker',
        ],
        featured: true,
    },
    {
        name: 'Rustic Mountain Hideaway',
        slug: 'rustic-mountain-hideaway',
        shortDescription: 'Budget-friendly cabin with authentic alpine charm.',
        description:
            'A traditional cabin offering authentic mountain living. Simple but comfortable, with stunning hiking trails right from your doorstep. Perfect for adventurers.',
        location: 'Stonebrook Trail',
        nightlyRateDollars: 150,
        maxGuests: 4,
        beds: 2,
        bathrooms: 1,
        createdAt: '2024-02-28T13:20:00Z',
        updatedAt: '2024-09-15T17:00:00Z',
        image: 'cabin-005.jpg',
        amenityNames: ['WiFi', 'Kitchen', 'Fireplace', 'Parking'],
        featured: true,
    },
    {
        name: 'Sunset Valley Cottage',
        slug: 'sunset-valley-cottage',
        shortDescription: 'Charming cottage with valley views and a garden terrace.',
        description:
            'Enjoy spectacular sunsets from your private terrace. This cottage combines modern comfort with rustic elegance, featuring an outdoor dining area and herb garden.',
        location: 'Sunset Valley',
        nightlyRateDollars: 210,
        maxGuests: 5,
        beds: 2,
        bathrooms: 2,
        createdAt: '2024-03-15T15:30:00Z',
        updatedAt: '2024-10-09T11:40:00Z',
        image: 'cabin-006.jpg',
        amenityNames: ['WiFi', 'Kitchen', 'Garden', 'Grill / BBQ', 'Coffee Maker'],
        featured: true,
    },
    {
        name: 'Hidden Creek Cabin',
        slug: 'hidden-creek',
        shortDescription: 'Secluded cabin tucked beside a running creek.',
        description:
            'Fall asleep to the sound of running water in this secluded retreat. An outdoor shower and private garden make it easy to slow down and disconnect for a few days.',
        location: 'Hidden Creek',
        nightlyRateDollars: 195,
        maxGuests: 4,
        beds: 2,
        bathrooms: 1,
        createdAt: '2024-04-02T09:00:00Z',
        updatedAt: '2024-10-12T09:00:00Z',
        image: 'cabin-007.jpg',
        amenityNames: ['WiFi', 'Kitchen', 'Outdoor Shower', 'Garden', 'Fireplace', 'Pet Friendly'],
        featured: false,
    },
    {
        name: 'Blackwood Lodge',
        slug: 'blackwood',
        shortDescription: 'Well-equipped lodge for larger groups, deep in the forest.',
        description:
            'A roomy lodge built for groups who want to be together and still have space to spread out. Board games by the fire, a full kitchen for group cooking, and a grill for warm evenings outside.',
        location: 'Blackwood Forest',
        nightlyRateDollars: 380,
        maxGuests: 8,
        beds: 4,
        bathrooms: 3,
        createdAt: '2024-04-20T10:00:00Z',
        updatedAt: '2024-10-14T10:00:00Z',
        image: 'cabin-008.jpg',
        amenityNames: [
            'WiFi',
            'Kitchen',
            'Fireplace',
            'Board Games',
            'TV / Streaming',
            'Grill / BBQ',
            'Parking',
            'Workspace',
            'Smoke Detector',
            'First Aid Kit',
        ],
        featured: false,
    },
];

type StoredImages = { coverImage: string; galleryImages: string[] };

async function main() {
    console.log('Checking for already-seeded cabins...');
    const existingBySlug = new Map<string, StoredImages | null>(
        CABINS.map((cabin) => [
            cabin.slug,
            runConvex('cabins:getStorageIdsBySlug', { slug: cabin.slug }) as StoredImages | null,
        ]),
    );

    const newCabins = CABINS.filter((cabin) => !existingBySlug.get(cabin.slug));

    if (newCabins.length > 0) console.log(`Uploading ${newCabins.length} new cabin image(s)...`);
    const uploadedStorageIds = new Map<string, string>();

    for (const cabin of newCabins) {
        if (uploadedStorageIds.has(cabin.image)) continue;

        uploadedStorageIds.set(cabin.image, await uploadImage(cabin.image));
        console.log(`  uploaded ${cabin.image}`);
    }

    console.log('Seeding amenities...');
    runConvex('amenities:seedAmenities');

    // Upsert every cabin: an existing one keeps its already-uploaded images
    // (only its metadata -- e.g. `featured` -- may have changed); a new one
    // gets the image just uploaded for it above.
    console.log('Seeding cabins...');
    const cabinsPayload = CABINS.map((cabin) => {
        const nightlyRate = Math.round(cabin.nightlyRateDollars * CENTS_PER_DOLLAR);
        const stored = existingBySlug.get(cabin.slug);
        const coverImage = stored?.coverImage ?? uploadedStorageIds.get(cabin.image);
        const galleryImages = stored?.galleryImages ?? (coverImage ? [coverImage] : undefined);

        if (!coverImage || !galleryImages) {
            throw new Error(`Missing image for ${cabin.image}`);
        }

        return {
            name: cabin.name,
            slug: cabin.slug,
            shortDescription: cabin.shortDescription,
            description: cabin.description,
            location: cabin.location,
            nightlyRate,
            cleaningFee: cleaningFeeFor(nightlyRate),
            maxGuests: cabin.maxGuests,
            bedrooms: Math.max(1, Math.ceil(cabin.beds / 2)),
            beds: cabin.beds,
            bathrooms: cabin.bathrooms,
            coverImage,
            galleryImages,
            amenityNames: cabin.amenityNames,
            published: true,
            featured: cabin.featured,
            createdAt: Date.parse(cabin.createdAt),
            updatedAt: Date.parse(cabin.updatedAt),
        };
    });

    const ids = runConvex('cabins:seedCabins', { cabins: cabinsPayload }) as string[];
    console.log(`Done -- ${ids.length} cabin(s) synced.`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
