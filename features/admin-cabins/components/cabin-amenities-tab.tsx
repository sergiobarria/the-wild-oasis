'use client';

import { useQuery } from 'convex/react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';

import type { CabinFormApi } from '../use-cabin-form';

export function CabinAmenitiesTab({ form }: { form: CabinFormApi }) {
    const amenities = useQuery(api.amenities.list);

    if (amenities === undefined) {
        return (
            <div className='grid gap-2 sm:grid-cols-2'>
                {Array.from({ length: 6 }, (_, index) => (
                    <Skeleton key={index} className='h-6 w-full' />
                ))}
            </div>
        );
    }

    return (
        <form.Field name='amenityIds'>
            {(field) => {
                const selected = field.state.value as string[];

                return (
                    <div className='grid gap-2 sm:grid-cols-2'>
                        {amenities.map((amenity) => {
                            const checked = selected.includes(amenity._id);
                            const id = `amenity-${amenity._id}`;

                            return (
                                <div key={amenity._id} className='flex items-center gap-2'>
                                    <Checkbox
                                        id={id}
                                        checked={checked}
                                        onCheckedChange={(nextChecked) =>
                                            field.handleChange(
                                                nextChecked
                                                    ? [...selected, amenity._id]
                                                    : selected.filter((id) => id !== amenity._id),
                                            )
                                        }
                                    />
                                    <Label htmlFor={id}>{amenity.name}</Label>
                                </div>
                            );
                        })}
                    </div>
                );
            }}
        </form.Field>
    );
}
