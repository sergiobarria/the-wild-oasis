import type { FunctionReturnType } from 'convex/server';
import { Bath, BedDouble, MapPin, Users } from 'lucide-react';

import type { api } from '@/convex/_generated/api';

import { CabinAmenitiesGrid } from './components/cabin-amenities-grid';
import { CabinBookingPanel } from './components/cabin-booking-panel';
import { CabinGallery } from './components/cabin-gallery';
import { CabinPoliciesSection } from './components/cabin-policies-section';
import { CabinReviewsSection } from './components/cabin-reviews-section';

type Cabin = NonNullable<FunctionReturnType<typeof api.cabins.getBySlug>>;

export function CabinDetailScreen({ cabin }: { cabin: Cabin }) {
    const images =
        cabin.galleryImageUrls.length > 0 ? cabin.galleryImageUrls : ['/assets/placeholder.jpg'];

    return (
        <div className='mx-auto w-full max-w-6xl space-y-8 px-6 py-12 lg:px-8'>
            <CabinGallery images={images} cabinName={cabin.name} />

            <div className='space-y-2'>
                <h1 className='font-heading text-3xl font-medium'>{cabin.name}</h1>
                <p className='flex items-center gap-1.5 text-muted-foreground'>
                    <MapPin className='size-4' aria-hidden='true' />
                    {cabin.location}
                </p>
            </div>

            {/* Booking panel is first in DOM (mobile-natural order, and reaches keyboard/screen
                reader users early) -- CSS Grid placement reflows it to a sticky right column on
                desktop without needing an `order-*` override. */}
            <div className='grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-12'>
                <div className='lg:order-2'>
                    <CabinBookingPanel
                        cabinId={cabin._id}
                        nightlyRate={cabin.nightlyRate}
                        cleaningFee={cabin.cleaningFee}
                        maxGuests={cabin.maxGuests}
                    />
                </div>

                <div className='space-y-10 lg:order-1'>
                    <div className='flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground'>
                        <span className='flex items-center gap-1.5'>
                            <Users className='size-4' aria-hidden='true' />
                            {cabin.maxGuests} guests
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <BedDouble className='size-4' aria-hidden='true' />
                            {cabin.bedrooms} bedrooms, {cabin.beds} beds
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <Bath className='size-4' aria-hidden='true' />
                            {cabin.bathrooms} bathrooms
                        </span>
                    </div>

                    <p className='text-muted-foreground'>{cabin.description}</p>

                    <div className='space-y-4'>
                        <h2 className='font-heading text-xl font-medium'>Amenities</h2>
                        <CabinAmenitiesGrid amenities={cabin.amenities} />
                    </div>

                    <div className='space-y-4'>
                        <h2 className='font-heading text-xl font-medium'>House Rules</h2>
                        <CabinPoliciesSection />
                    </div>

                    <div className='space-y-4'>
                        <h2 className='font-heading text-xl font-medium'>Reviews</h2>
                        <CabinReviewsSection
                            reviews={cabin.reviews}
                            averageRating={cabin.averageRating}
                            reviewCount={cabin.reviewCount}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
