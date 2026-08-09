'use client';

import { useQuery } from 'convex/react';
import { debounce, useQueryStates } from 'nuqs';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';
import { AMENITY_ICON_MAP, CURATED_AMENITY_NAMES } from '@/lib/amenity-icons';
import { GUEST_OPTIONS } from '@/lib/guest-options';
import { cn } from '@/lib/utils';

import { filterParsers, hasActiveFilters, searchControlParsers } from '../cabins-domain';

export function CabinFilters() {
    const [searchControls, setSearchControls] = useQueryStates(searchControlParsers);
    const [filters, setFilters] = useQueryStates(filterParsers);
    const amenities = useQuery(api.amenities.list);

    const curatedAmenities = amenities
        ? CURATED_AMENITY_NAMES.map((name) =>
              amenities.find((amenity) => amenity.name === name),
          ).filter((amenity) => amenity !== undefined)
        : [];

    function toggleAmenity(id: string) {
        setFilters((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(id)
                ? prev.amenities.filter((amenityId) => amenityId !== id)
                : [...prev.amenities, id],
        }));
    }

    return (
        <Card>
            <CardContent className='space-y-4'>
                <div className='space-y-1.5'>
                    <Label htmlFor='cabins-search'>Search</Label>
                    <Input
                        id='cabins-search'
                        type='search'
                        placeholder='Search cabins by name...'
                        value={filters.search}
                        onChange={(event) => {
                            const raw = event.target.value;
                            setFilters(
                                { search: raw },
                                { limitUrlUpdates: raw === '' ? undefined : debounce(400) },
                            );
                        }}
                    />
                </div>

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <div className='space-y-1.5'>
                        <Label htmlFor='cabins-check-in'>Check-in</Label>
                        <Input
                            id='cabins-check-in'
                            type='date'
                            value={searchControls.checkIn}
                            onChange={(event) => setSearchControls({ checkIn: event.target.value })}
                        />
                    </div>

                    <div className='space-y-1.5'>
                        <Label htmlFor='cabins-check-out'>Check-out</Label>
                        <Input
                            id='cabins-check-out'
                            type='date'
                            min={searchControls.checkIn || undefined}
                            value={searchControls.checkOut}
                            onChange={(event) =>
                                setSearchControls({ checkOut: event.target.value })
                            }
                        />
                    </div>

                    <div className='space-y-1.5'>
                        <Label htmlFor='cabins-guests'>Guests</Label>
                        <Select
                            value={searchControls.guests}
                            onValueChange={(value) => setSearchControls({ guests: value ?? '1' })}
                        >
                            <SelectTrigger id='cabins-guests' className='w-full'>
                                <SelectValue placeholder='Guests' />
                            </SelectTrigger>
                            <SelectContent>
                                {GUEST_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option} {option === '1' ? 'guest' : 'guests'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-1.5'>
                        <Label htmlFor='cabins-max-price'>Max price</Label>
                        <Input
                            id='cabins-max-price'
                            type='number'
                            min={0}
                            placeholder='Any'
                            value={filters.maxPrice ?? ''}
                            onChange={(event) => {
                                const raw = event.target.value;
                                setFilters(
                                    { maxPrice: raw === '' ? null : Number(raw) },
                                    { limitUrlUpdates: raw === '' ? undefined : debounce(400) },
                                );
                            }}
                        />
                    </div>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    {curatedAmenities.map((amenity) => {
                        const Icon = AMENITY_ICON_MAP[amenity.name];
                        const active = filters.amenities.includes(amenity._id);

                        return (
                            <button
                                key={amenity._id}
                                type='button'
                                aria-pressed={active}
                                onClick={() => toggleAmenity(amenity._id)}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                                    active
                                        ? 'border-primary/40 bg-primary/10 text-primary'
                                        : 'border-border text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {Icon && <Icon className='size-3.5' aria-hidden='true' />}
                                {amenity.name}
                            </button>
                        );
                    })}

                    {hasActiveFilters(filters) && (
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='ml-auto'
                            onClick={() => setFilters(null)}
                        >
                            Clear filters
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
