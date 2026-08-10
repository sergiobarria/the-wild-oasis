'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';

function SettingsForm({
    initialCancellationWindowHours,
}: {
    initialCancellationWindowHours: number;
}) {
    const adminUpdateSettings = useMutation(api.appSettings.adminUpdateSettings);
    const [cancellationWindowHours, setCancellationWindowHours] = useState(
        String(initialCancellationWindowHours),
    );
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);

        const parsed = Number(cancellationWindowHours);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            setError('Enter a whole number of hours greater than 0.');
            return;
        }

        setSaving(true);
        try {
            await adminUpdateSettings({ cancellationWindowHours: parsed });
            toast.success('Settings saved');
        } catch (thrown) {
            setError(
                thrown instanceof ConvexError && typeof thrown.data === 'string'
                    ? thrown.data
                    : 'Something went wrong saving settings. Please try again.',
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='max-w-sm space-y-4'>
            <div className='space-y-1.5'>
                <Label htmlFor='cancellation-window'>Guest self-cancellation window (hours)</Label>
                <Input
                    id='cancellation-window'
                    type='number'
                    min={1}
                    step={1}
                    required
                    value={cancellationWindowHours}
                    onChange={(event) => setCancellationWindowHours(event.target.value)}
                />
                <p className='text-xs text-muted-foreground'>
                    Guests can self-cancel a reservation up until this many hours before check-in.
                </p>
            </div>

            {error && (
                <p role='alert' className='text-sm text-destructive'>
                    {error}
                </p>
            )}

            <Button type='submit' disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
            </Button>
        </form>
    );
}

export function AdminSettingsScreen() {
    const settings = useQuery(api.appSettings.adminGetAppSettings);

    return (
        <div className='space-y-6'>
            <h1 className='font-heading text-2xl font-medium'>Settings</h1>

            {settings === undefined ? (
                <div className='max-w-sm space-y-2'>
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-9 w-24' />
                </div>
            ) : (
                // Keyed by `updatedAt` -- if another admin session changes the setting while
                // this one has the page open, the reactive query updates `settings` but a bare
                // `useState` seeded from a prop would not re-initialize on its own. The key
                // forces a remount so the input picks up the new live value.
                <SettingsForm
                    key={settings.updatedAt ?? 'default'}
                    initialCancellationWindowHours={settings.cancellationWindowHours}
                />
            )}
        </div>
    );
}
