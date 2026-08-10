'use client';

import Link from 'next/link';

import { useQuery } from 'convex/react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { api } from '@/convex/_generated/api';
import { ReservationStatusBadge } from '@/features/guest-area/components/reservation-status-badge';
import { formatCents } from '@/lib/money';
import { APP_ROUTES } from '@/lib/routes';

import { initials } from './admin-users-domain';

export function AdminUserDetailScreen({ userId }: { userId: string }) {
    const user = useQuery(api.users.adminGetUserDetail, { userId });

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='font-heading text-2xl font-medium'>User details</h1>
                <Button variant='ghost' render={<Link href={APP_ROUTES.ADMIN_USERS} />}>
                    Back to users
                </Button>
            </div>

            {user === undefined && (
                <div className='space-y-2'>
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className='h-10 w-full' />
                    ))}
                </div>
            )}

            {user === null && (
                <p className='text-sm text-muted-foreground'>This user could not be found.</p>
            )}

            {user && (
                <>
                    <div className='flex items-center gap-4'>
                        <Avatar size='lg'>
                            <AvatarFallback>{initials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className='font-heading text-lg font-medium'>{user.name}</p>
                            <p className='text-sm text-muted-foreground'>{user.email}</p>
                            {user.phone && (
                                <p className='text-sm text-muted-foreground'>{user.phone}</p>
                            )}
                        </div>
                        <Badge
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className='ml-auto'
                        >
                            {user.role}
                        </Badge>
                    </div>

                    <div className='space-y-3'>
                        <h2 className='font-heading text-lg font-medium'>Reservation history</h2>
                        {user.reservations.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>No reservations yet.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cabin</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {user.reservations.map((reservation) => (
                                        <TableRow key={reservation._id}>
                                            <TableCell>{reservation.cabinName}</TableCell>
                                            <TableCell>
                                                {reservation.checkIn} &rarr; {reservation.checkOut}
                                            </TableCell>
                                            <TableCell>
                                                <ReservationStatusBadge
                                                    status={reservation.status}
                                                />
                                            </TableCell>
                                            <TableCell>{formatCents(reservation.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
