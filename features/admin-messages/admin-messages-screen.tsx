'use client';

import { useQuery } from 'convex/react';
import { useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { MESSAGE_STATUS, type MessageStatus } from '@/convex/lib/messages';
import { cn } from '@/lib/utils';

import { MessageRow } from './components/message-row';

const FILTERS = [
    { value: 'all', label: 'All' },
    { value: MESSAGE_STATUS.UNREAD, label: 'Unread' },
    { value: MESSAGE_STATUS.READ, label: 'Read' },
    { value: MESSAGE_STATUS.ARCHIVED, label: 'Archived' },
] as const;

export function AdminMessagesScreen() {
    const [status, setStatus] = useQueryState('status', { defaultValue: 'all' });
    const messages = useQuery(api.messages.adminListMessages, {
        status: status === 'all' ? undefined : (status as MessageStatus),
    });

    return (
        <div className='space-y-6'>
            <h1 className='font-heading text-2xl font-medium'>Messages</h1>

            <div className='flex flex-wrap gap-2'>
                {FILTERS.map((filter) => (
                    <Button
                        key={filter.value}
                        type='button'
                        variant='outline'
                        size='sm'
                        className={cn(status === filter.value && 'bg-secondary')}
                        onClick={() => setStatus(filter.value)}
                    >
                        {filter.label}
                    </Button>
                ))}
            </div>

            {messages === undefined ? (
                <div className='space-y-2'>
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className='h-24 w-full rounded-lg' />
                    ))}
                </div>
            ) : messages.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No messages here.</p>
            ) : (
                <div className='space-y-3'>
                    {messages.map((message) => (
                        <MessageRow key={message._id} message={message} />
                    ))}
                </div>
            )}
        </div>
    );
}
