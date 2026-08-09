import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type StarRatingProps = {
    /** 0-5, may be fractional (e.g. an average) -- rounded to the nearest whole star. */
    rating: number;
    size?: 'sm' | 'default';
};

export function StarRating({ rating, size = 'default' }: StarRatingProps) {
    const filledCount = Math.round(rating);
    const starSize = size === 'sm' ? 'size-3.5' : 'size-4';

    return (
        <div
            className='flex items-center gap-0.5'
            role='img'
            aria-label={`${rating} out of 5 stars`}
        >
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    aria-hidden='true'
                    className={cn(
                        starSize,
                        index < filledCount
                            ? 'fill-primary text-primary'
                            : 'fill-none text-muted-foreground',
                    )}
                />
            ))}
        </div>
    );
}
