import { StarRating } from '@/components/star-rating';

type Review = {
    _id: string;
    rating: number;
    comment: string;
    authorName: string;
    authorImage?: string;
    createdAt: number;
};

type CabinReviewsSectionProps = {
    reviews: Review[];
    averageRating: number | null;
    reviewCount: number;
};

export function CabinReviewsSection({
    reviews,
    averageRating,
    reviewCount,
}: CabinReviewsSectionProps) {
    return (
        <div className='space-y-6'>
            {averageRating !== null ? (
                <div className='flex items-center gap-3'>
                    <StarRating rating={averageRating} />
                    <span className='text-sm text-muted-foreground'>
                        {averageRating.toFixed(1)} &middot; {reviewCount}{' '}
                        {reviewCount === 1 ? 'review' : 'reviews'}
                    </span>
                </div>
            ) : (
                <p className='text-sm text-muted-foreground'>No reviews yet.</p>
            )}

            {reviews.length > 0 && (
                <ul className='space-y-6'>
                    {reviews.map((review) => (
                        <li
                            key={review._id}
                            className='space-y-2 border-t border-border pt-6 first:border-t-0 first:pt-0'
                        >
                            <div className='flex items-center gap-3'>
                                {/* No authorImage on any seeded review -- initial-letter fallback,
                                    never a broken-avatar state. */}
                                <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium'>
                                    {review.authorName.charAt(0)}
                                </div>
                                <div>
                                    <p className='text-sm font-medium'>{review.authorName}</p>
                                    <p className='text-xs text-muted-foreground'>
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                        })}
                                    </p>
                                </div>
                                <div className='ml-auto'>
                                    <StarRating rating={review.rating} size='sm' />
                                </div>
                            </div>
                            <p className='text-sm text-muted-foreground'>{review.comment}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
