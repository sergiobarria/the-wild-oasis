'use client';

import Link from 'next/link';

import { useQuery } from 'convex/react';
import { debounce, parseAsString, useQueryStates } from 'nuqs';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { adminUserDetailHref } from '@/lib/routes';

const ALL_VALUE = 'all';

const filterParsers = {
    search: parseAsString.withDefault(''),
    role: parseAsString.withDefault(''),
};

function initials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function AdminUsersScreen() {
    const [filters, setFilters] = useQueryStates(filterParsers);
    const users = useQuery(api.users.adminListUsers, {
        search: filters.search || undefined,
        role: filters.role || undefined,
    });

    return (
        <div className='space-y-6'>
            <h1 className='font-heading text-2xl font-medium'>Users</h1>

            <div className='flex flex-wrap gap-4'>
                <Input
                    type='search'
                    placeholder='Search by name or email...'
                    value={filters.search}
                    onChange={(event) => {
                        const raw = event.target.value;
                        setFilters(
                            { search: raw },
                            { limitUrlUpdates: raw === '' ? undefined : debounce(400) },
                        );
                    }}
                    className='max-w-sm'
                />
                <Select
                    value={filters.role || ALL_VALUE}
                    onValueChange={(value) =>
                        setFilters({ role: value === ALL_VALUE ? '' : value })
                    }
                >
                    <SelectTrigger className='w-40'>
                        <SelectValue placeholder='Any role' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_VALUE}>Any role</SelectItem>
                        <SelectItem value='guest'>Guest</SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {users === undefined ? (
                <div className='space-y-2'>
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className='h-12 w-full rounded-lg' />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No users match these filters.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Bookings</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <Link
                                        href={adminUserDetailHref(user._id) as never}
                                        className='flex items-center gap-2 font-medium underline-offset-4 hover:underline'
                                    >
                                        <Avatar size='sm'>
                                            <AvatarFallback>{initials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        {user.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                                    >
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.reservationCount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
