'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

/** Flags whose toggle needs a confirming click before it takes effect -- flipping payments or
 *  similar consequential systems on/off shouldn't be a single misclick. */
const CONSEQUENTIAL_FLAG_KEYS = new Set(['stripePaymentsEnabled']);

type AdminFlag = {
    _id: Id<'featureFlags'>;
    key: string;
    name: string;
    description: string;
    enabled: boolean;
    updatedAt: number;
    updatedByName?: string;
};

function FlagRow({ flag }: { flag: AdminFlag }) {
    const adminToggleFlag = useMutation(api.featureFlags.adminToggleFlag);
    const [confirming, setConfirming] = useState(false);
    const [pending, setPending] = useState(false);

    async function toggle(enabled: boolean) {
        setPending(true);
        try {
            await adminToggleFlag({ flagId: flag._id, enabled });
            toast.success(`${flag.name} ${enabled ? 'enabled' : 'disabled'}`);
        } catch {
            toast.error('Something went wrong updating this flag.');
        } finally {
            setPending(false);
            setConfirming(false);
        }
    }

    function handleToggleClick() {
        const next = !flag.enabled;
        if (CONSEQUENTIAL_FLAG_KEYS.has(flag.key)) {
            setConfirming(true);
        } else {
            toggle(next);
        }
    }

    return (
        <Card>
            <CardContent className='flex items-start justify-between gap-4'>
                <div className='space-y-1'>
                    <p className='font-medium'>{flag.name}</p>
                    <p className='text-sm text-muted-foreground'>{flag.description}</p>
                    <p className='text-xs text-muted-foreground'>
                        Last updated by {flag.updatedByName ?? 'Seed default'} on{' '}
                        {new Date(flag.updatedAt).toLocaleString()}
                    </p>
                </div>
                <Button
                    type='button'
                    variant={flag.enabled ? 'default' : 'outline'}
                    disabled={pending}
                    onClick={handleToggleClick}
                >
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                </Button>
            </CardContent>

            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {flag.enabled ? 'Disable' : 'Enable'} {flag.name}?
                        </DialogTitle>
                    </DialogHeader>
                    <p className='text-sm text-muted-foreground'>
                        This is a consequential flag -- confirm before{' '}
                        {flag.enabled ? 'disabling' : 'enabling'} it.
                    </p>
                    <DialogFooter>
                        <Button
                            type='button'
                            variant='ghost'
                            disabled={pending}
                            onClick={() => setConfirming(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='button'
                            disabled={pending}
                            onClick={() => toggle(!flag.enabled)}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export function AdminFeatureFlagsScreen() {
    const flags = useQuery(api.featureFlags.adminListFlags);

    return (
        <div className='space-y-6'>
            <h1 className='font-heading text-2xl font-medium'>Feature flags</h1>

            {flags === undefined ? (
                <div className='space-y-2'>
                    {Array.from({ length: 3 }, (_, index) => (
                        <Skeleton key={index} className='h-24 w-full rounded-lg' />
                    ))}
                </div>
            ) : flags.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No feature flags yet.</p>
            ) : (
                <div className='space-y-3'>
                    {flags.map((flag) => (
                        <FlagRow key={flag._id} flag={flag} />
                    ))}
                </div>
            )}
        </div>
    );
}
