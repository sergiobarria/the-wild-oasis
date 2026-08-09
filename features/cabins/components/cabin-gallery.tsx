'use client';

import { useState } from 'react';

import Image from 'next/image';

import { CabinGalleryLightbox } from './cabin-gallery-lightbox';

type CabinGalleryProps = {
    images: string[];
    cabinName: string;
};

export function CabinGallery({ images, cabinName }: CabinGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    // Forces the lightbox to remount (and re-read `initialIndex` fresh) on every open, even
    // when reopening at the same index after navigating internally with prev/next.
    const [openCount, setOpenCount] = useState(0);

    function openAt(index: number) {
        setSelectedIndex(index);
        setOpenCount((count) => count + 1);
        setLightboxOpen(true);
    }

    return (
        <div className='space-y-2'>
            <button
                type='button'
                onClick={() => openAt(0)}
                className='relative block aspect-video w-full overflow-hidden rounded-xl'
            >
                <Image
                    src={images[0]}
                    alt={`${cabinName} photo 1 of ${images.length}`}
                    fill
                    sizes='(min-width: 1024px) 66vw, 100vw'
                    className='object-cover'
                    priority
                />
            </button>

            {/* Secondary images only -- the primary is already shown large above. CSS
                scroll-snap gives native swipe on mobile for free. Only shown once a cabin
                actually has more than one photo (today: every seeded cabin has one). */}
            {images.length > 1 && (
                <div className='flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1'>
                    {images.slice(1).map((src, secondaryIndex) => {
                        const index = secondaryIndex + 1;

                        return (
                            <button
                                key={src}
                                type='button'
                                onClick={() => openAt(index)}
                                className='relative aspect-video w-32 shrink-0 snap-start overflow-hidden rounded-lg'
                            >
                                <Image
                                    src={src}
                                    alt={`${cabinName} photo ${index + 1} of ${images.length}`}
                                    fill
                                    sizes='128px'
                                    className='object-cover'
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            <CabinGalleryLightbox
                key={openCount}
                images={images}
                cabinName={cabinName}
                open={lightboxOpen}
                onOpenChange={setLightboxOpen}
                initialIndex={selectedIndex}
            />
        </div>
    );
}
