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
import { PAYMENT_STATUS, RESERVATION_STATUS } from '@/convex/lib/reservations';

import { adminBookingFilterParsers, hasActiveAdminBookingFilters } from '../admin-bookings-domain';

const STATUS_OPTIONS = Object.values(RESERVATION_STATUS);
const PAYMENT_STATUS_OPTIONS = Object.values(PAYMENT_STATUS);

const ALL_VALUE = 'all';

export function BookingFilters() {
    const [filters, setFilters] = useQueryStates(adminBookingFilterParsers);
    const cabins = useQuery(api.cabins.listPublished, {
        paginationOpts: { numItems: 100, cursor: null },
    });

    return (
        <Card>
            <CardContent className='space-y-4'>
                <div className='space-y-1.5'>
                    <Label htmlFor='bookings-search'>Search</Label>
                    <Input
                        id='bookings-search'
                        type='search'
                        placeholder='Search by guest name, email, or reference...'
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

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
                    <div className='space-y-1.5'>
                        <Label htmlFor='bookings-status'>Status</Label>
                        <Select
                            value={filters.status || ALL_VALUE}
                            onValueChange={(value) =>
                                setFilters({ status: value === ALL_VALUE ? '' : value })
                            }
                        >
                            <SelectTrigger id='bookings-status' className='w-full'>
                                <SelectValue placeholder='Any status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_VALUE}>Any status</SelectItem>
                                {STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-1.5'>
                        <Label htmlFor='bookings-payment-status'>Payment</Label>
                        <Select
                            value={filters.paymentStatus || ALL_VALUE}
                            onValueChange={(value) =>
                                setFilters({ paymentStatus: value === ALL_VALUE ? '' : value })
                            }
                        >
                            <SelectTrigger id='bookings-payment-status' className='w-full'>
                                <SelectValue placeholder='Any payment status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_VALUE}>Any payment status</SelectItem>
                                {PAYMENT_STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-1.5'>
                        <Label htmlFor='bookings-cabin'>Cabin</Label>
                        <Select
                            value={filters.cabinId || ALL_VALUE}
                            onValueChange={(value) =>
                                setFilters({ cabinId: value === ALL_VALUE ? '' : value })
                            }
                        >
                            <SelectTrigger id='bookings-cabin' className='w-full'>
                                <SelectValue placeholder='Any cabin' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_VALUE}>Any cabin</SelectItem>
                                {cabins?.page.map((cabin) => (
                                    <SelectItem key={cabin._id} value={cabin._id}>
                                        {cabin.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-1.5'>
                        <Label htmlFor='bookings-check-in-from'>Check-in from</Label>
                        <Input
                            id='bookings-check-in-from'
                            type='date'
                            value={filters.checkInFrom}
                            onChange={(event) => setFilters({ checkInFrom: event.target.value })}
                        />
                    </div>

                    <div className='space-y-1.5'>
                        <Label htmlFor='bookings-check-in-to'>Check-in to</Label>
                        <Input
                            id='bookings-check-in-to'
                            type='date'
                            min={filters.checkInFrom || undefined}
                            value={filters.checkInTo}
                            onChange={(event) => setFilters({ checkInTo: event.target.value })}
                        />
                    </div>
                </div>

                {hasActiveAdminBookingFilters(filters) && (
                    <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => setFilters(null)}
                    >
                        Clear filters
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
