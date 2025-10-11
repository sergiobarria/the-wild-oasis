import React from 'react'

import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { format } from 'date-fns'
import { ArrowLeftIcon, BathIcon, BedDoubleIcon, CheckIcon, StarIcon, UserPlusIcon, XIcon } from 'lucide-react'

import { Typography } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CabinCard } from '@/features/cabins/components/cabin-card'
import { cabinQueries } from '@/features/cabins/queries'

export const Route = createFileRoute('/(web)/cabins/$cabinSlug')({
    component: RouteComponent,
    loader: async ({ context, params }) => {
        const data = await context.queryClient.ensureQueryData(cabinQueries.bySlug(params.cabinSlug))
        if (!data.id) {
            throw notFound()
        }

        return data
    },
})

// Mock data for image gallery until we have real images
// Change the length to 0 to show the no images message
const galleryImages = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    url: '/placeholder.jpg',
}))

function RouteComponent() {
    const data = Route.useLoaderData()
    // TODO: Use a lightbox library/component instead of this custom implementation
    const [lightbox, setLightbox] = React.useState<{
        show: boolean
        image: string
    }>({ show: false, image: '' })

    // calculate rating
    const reviews = data?.reviews || []
    const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

    // Close lightbox on escape key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setLightbox({ show: false, image: '' })
        }
    }

    return (
        <>
            <section className="mx-auto max-w-7xl px-8 pt-12 pb-16">
                <Button variant="link" asChild className="p-0">
                    <Link to="/cabins">
                        <ArrowLeftIcon />
                        Return to all cabins
                    </Link>
                </Button>

                {/* Cover Image */}
                <div className="relative h-[60vh] overflow-hidden rounded-xl shadow">
                    <img src="/placeholder.jpg" alt={data?.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                        <Typography variant="h1" size="xl" className="text-4xl font-bold">
                            {data?.name}
                        </Typography>
                        <Typography className="mt-2 text-base">{data?.summary}</Typography>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-10 leading-relaxed md:col-span-2">
                        <div className="space-y-4">
                            <blockquote className="border-accent mb-8 border-l-4 pl-4 text-lg italic">
                                “The most relaxing vacation we've had in years. We’ll be back every winter.”
                            </blockquote>

                            <Typography size="xl" className="text-primary font-semibold">
                                Description
                            </Typography>
                            <Typography className="text-base">{data?.description}</Typography>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2 text-sm">
                            <p>🌿 Perfect for couples seeking peace & nature</p>
                            <p>🔥 Great for winter retreats with fireplace & hot tub</p>
                            <p>👨‍👩‍👧 Ideal for families (max {data?.maxGuests} guests)</p>
                        </div>

                        <div className="space-y-4">
                            <Typography size="xl" className="text-primary font-semibold">
                                Amenities
                            </Typography>
                            <ul className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                                {data?.amenities?.map((amenity) => (
                                    <li key={amenity} className="flex items-center gap-2">
                                        <CheckIcon className="text-primary size-4" />
                                        {amenity}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <Typography size="xl" className="text-primary font-semibold">
                                Image Gallery
                            </Typography>

                            {galleryImages.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        {galleryImages.map((image) => (
                                            <img
                                                key={image.id}
                                                src={image.url}
                                                alt={`${data?.name} - ${image.id + 1}`}
                                                className="h-48 w-full cursor-pointer rounded-lg object-cover transition hover:brightness-110"
                                                onClick={() => setLightbox({ show: true, image: image.url })}
                                            />
                                        ))}
                                    </div>

                                    {/* Lightbox Modal */}
                                    {lightbox.show && (
                                        <div
                                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
                                            onKeyDown={handleKeyDown}
                                            onClick={() => setLightbox({ show: false, image: '' })}
                                        >
                                            <div
                                                className="relative w-full max-w-4xl px-4"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <img
                                                    src={lightbox.image}
                                                    alt="Expanded view"
                                                    className="mx-auto max-h-[90dvh] rounded-lg shadow-xl"
                                                />
                                                <button
                                                    onClick={() => setLightbox({ show: false, image: '' })}
                                                    className="bg-accent absolute top-5 right-10 rounded-full p-2 text-3xl font-bold text-zinc-300 transition hover:text-white"
                                                    aria-label="Close modal"
                                                >
                                                    <XIcon className="size-6" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Typography className="text-base">
                                    There are no images for this cabin at this time.
                                </Typography>
                            )}
                        </div>

                        {/* Policies */}
                        <div className="space-y-4">
                            <Typography size="xl" className="text-primary font-semibold">
                                Good to know
                            </Typography>
                            <div className="space-y-2 text-sm">
                                <p>🕒 Check-in: 3:00 PM – Check-out: 11:00 AM</p>
                                <p>❌ No smoking inside. Pets allowed on request.</p>
                                <p>💳 Full refund if cancelled 7+ days before check-in.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Typography size="xl" className="text-primary font-semibold">
                                Latest Reviews
                            </Typography>

                            {data?.reviews?.length === 0 && (
                                <Typography size="xl" className="text-primary font-semibold">
                                    No reviews yet
                                </Typography>
                            )}

                            <ul className="space-y-4">
                                {data?.reviews?.map((review) => (
                                    <li key={review.id} className="rounded-xl border p-6">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="font-semibold">{review.author_name}</div>
                                            <div className="text-primary flex items-center gap-1">
                                                {Array.from({ length: review.rating }, (_, i) => (
                                                    <StarIcon key={i} className="size-4" />
                                                ))}
                                            </div>
                                        </div>
                                        <Typography className="text-sm">{review.comment}</Typography>
                                        <Typography className="text-muted-foreground mt-2 mb-0 text-xs">
                                            {format(review.createdAt, 'PP')}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="sticky top-6 space-y-6 self-start rounded-xl border p-6 shadow md:col-span-1">
                        {/* Price */}
                        <div>
                            <p className="text-sm">From</p>
                            <p className="text-primary text-2xl font-bold">
                                ${data?.pricePerNight?.toFixed(2)}
                                <span className="font-normal">/ night</span>
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 text-sm">
                            <StarIcon className="text-primary size-4" />
                            <span className="font-medium">{rating.toFixed(2)}</span>
                            <span>of {data?.reviews?.length} reviews</span>
                        </div>

                        {/* Specifications */}
                        <ul className="flex items-center justify-between gap-4 text-sm text-zinc-400">
                            <li className="flex flex-col items-center justify-center gap-2">
                                <BathIcon className="text-primary size-4" />
                                {data?.baths} {data?.baths === 1 ? 'bathroom' : 'bathrooms'}
                            </li>
                            <li className="flex flex-col items-center justify-center gap-2">
                                <BedDoubleIcon className="text-primary size-4" />
                                {data?.beds} {data?.beds === 1 ? 'bed' : 'beds'}
                            </li>
                            <li className="flex flex-col items-center justify-center gap-2">
                                <UserPlusIcon className="text-primary size-4" />
                                Max {data?.maxGuests} guests
                            </li>
                        </ul>

                        <Separator />
                    </div>
                </div>
            </section>

            {/* Recommended Cabins */}
            <section className="mx-auto max-w-7xl px-8 pt-12 pb-16">
                <Typography variant="h2" size="xl" className="text-4xl font-bold">
                    Recommended Cabins
                </Typography>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {data?.relatedCabins?.map((cabin) => (
                        <CabinCard key={cabin.id} cabin={cabin} />
                    ))}
                </div>
            </section>
        </>
    )
}
