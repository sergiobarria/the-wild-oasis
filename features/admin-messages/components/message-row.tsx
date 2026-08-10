'use client';

import { useMutation } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import type { MessageStatus } from '@/convex/lib/messages';

export type AdminMessage = FunctionReturnType<typeof api.messages.adminListMessages>[number];

const STATUS_LABELS: Record<MessageStatus, string> = {
    unread: 'Unread',
    read: 'Read',
    archived: 'Archived',
};

const STATUS_VARIANTS: Record<MessageStatus, 'default' | 'secondary' | 'outline'> = {
    unread: 'default',
    read: 'secondary',
    archived: 'outline',
};

export function MessageRow({ message }: { message: AdminMessage }) {
    const adminMarkRead = useMutation(api.messages.adminMarkRead);
    const adminMarkUnread = useMutation(api.messages.adminMarkUnread);
    const adminArchive = useMutation(api.messages.adminArchive);
    const adminUnarchive = useMutation(api.messages.adminUnarchive);

    async function run(action: () => Promise<unknown>) {
        try {
            await action();
        } catch {
            toast.error('Something went wrong updating this message.');
        }
    }

    return (
        <div className='space-y-2 rounded-lg border border-border p-4'>
            <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                    <p className='truncate font-medium'>{message.subject}</p>
                    <p className='text-sm text-muted-foreground'>
                        {message.name} &middot; {message.email}
                        {message.phone ? ` · ${message.phone}` : ''}
                    </p>
                </div>
                <Badge variant={STATUS_VARIANTS[message.status]}>
                    {STATUS_LABELS[message.status]}
                </Badge>
            </div>

            <p className='text-sm whitespace-pre-wrap text-foreground'>{message.message}</p>

            <div className='flex flex-wrap gap-2'>
                {message.status === 'unread' && (
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => run(() => adminMarkRead({ messageId: message._id }))}
                    >
                        Mark read
                    </Button>
                )}
                {message.status !== 'unread' && (
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => run(() => adminMarkUnread({ messageId: message._id }))}
                    >
                        Mark unread
                    </Button>
                )}
                {message.status !== 'archived' ? (
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => run(() => adminArchive({ messageId: message._id }))}
                    >
                        Archive
                    </Button>
                ) : (
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => run(() => adminUnarchive({ messageId: message._id }))}
                    >
                        Unarchive
                    </Button>
                )}
            </div>
        </div>
    );
}
