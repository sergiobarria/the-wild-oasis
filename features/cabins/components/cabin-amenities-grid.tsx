import { AMENITY_ICON_MAP } from '@/lib/amenity-icons';

type Amenity = { _id: string; name: string };

export function CabinAmenitiesGrid({ amenities }: { amenities: Amenity[] }) {
    if (amenities.length === 0) return null;

    return (
        <div className='grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3'>
            {amenities.map((amenity) => {
                const Icon = AMENITY_ICON_MAP[amenity.name];

                return (
                    <div key={amenity._id} className='flex items-center gap-2 text-sm'>
                        {Icon && (
                            <Icon className='size-4 shrink-0 text-primary' aria-hidden='true' />
                        )}
                        <span>{amenity.name}</span>
                    </div>
                );
            })}
        </div>
    );
}
