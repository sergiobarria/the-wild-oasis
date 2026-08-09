'use client';

import { useState } from 'react';

import Image from 'next/image';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type CabinGalleryLightboxProps = {
    images: string[];
    cabinName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialIndex: number;
};

export function CabinGalleryLightbox({
    images,
    cabinName,
    open,
    onOpenChange,
    initialIndex,
}: CabinGalleryLightboxProps) {
    // No effect needed to reset on reopen -- the parent remounts this component (via a
    // changing `key`) each time it's opened, so `initialIndex` is only ever read once, fresh.
    const [index, setIndex] = useState(initialIndex);

    function showPrevious() {
        setIndex((current) => (current - 1 + images.length) % images.length);
    }

    function showNext() {
        setIndex((current) => (current + 1) % images.length);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className='max-w-[calc(100%-2rem)] gap-0 border-none bg-transparent p-0 ring-0 sm:max-w-4xl'
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft') showPrevious();
                    if (event.key === 'ArrowRight') showNext();
                }}
            >
                <DialogTitle className='sr-only'>
                    {cabinName} photo {index + 1} of {images.length}
                </DialogTitle>
                <div className='relative aspect-video w-full overflow-hidden rounded-xl bg-black'>
                    <Image
                        src={images[index]}
                        alt={`${cabinName} photo ${index + 1} of ${images.length}`}
                        fill
                        sizes='(min-width: 640px) 56rem, 100vw'
                        className='object-contain'
                        priority
                    />
                </div>

                {images.length > 1 && (
                    <>
                        <Button
                            type='button'
                            variant='secondary'
                            size='icon'
                            className='absolute top-1/2 left-2 -translate-y-1/2'
                            onClick={showPrevious}
                        >
                            <ChevronLeftIcon />
                            <span className='sr-only'>Previous photo</span>
                        </Button>
                        <Button
                            type='button'
                            variant='secondary'
                            size='icon'
                            className='absolute top-1/2 right-2 -translate-y-1/2'
                            onClick={showNext}
                        >
                            <ChevronRightIcon />
                            <span className='sr-only'>Next photo</span>
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
