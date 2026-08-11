'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import type { Id } from '@/convex/_generated/dataModel';
import {
    AMENITY_CATEGORY,
    AMENITY_ICON_NAMES,
    type AmenityCategory,
    type AmenityIconName,
} from '@/convex/lib/amenities';
import { AMENITY_ICON_BY_KEY } from '@/lib/amenity-icons';
import { cn } from '@/lib/utils';

import {
    AMENITY_CATEGORY_LABELS,
    amenityFormDefaultValues,
    amenityFormSchema,
} from '../amenities-domain';

export type AdminAmenity = {
    _id: Id<'amenities'>;
    name: string;
    icon: string;
    category: string;
};

function errorToastMessage(thrown: unknown, fallback: string): string {
    return thrown instanceof ConvexError && typeof thrown.data === 'string'
        ? thrown.data
        : fallback;
}

export function AmenityFormDialog({
    open,
    onOpenChange,
    amenity,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Omit for create mode; pass the amenity being edited for edit mode. */
    amenity?: AdminAmenity;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {/* Keyed by which amenity (or "new") is being edited -- remounts on switch,
                    which re-seeds all form state from props for free instead of an effect. */}
                <AmenityForm
                    key={amenity?._id ?? 'new'}
                    amenity={amenity}
                    onDone={() => onOpenChange(false)}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

function AmenityForm({
    amenity,
    onDone,
    onCancel,
}: {
    amenity?: AdminAmenity;
    onDone: () => void;
    onCancel: () => void;
}) {
    const adminCreateAmenity = useMutation(api.amenities.adminCreateAmenity);
    const adminUpdateAmenity = useMutation(api.amenities.adminUpdateAmenity);

    const [name, setName] = useState(amenity?.name ?? amenityFormDefaultValues.name);
    const [icon, setIcon] = useState(amenity?.icon ?? amenityFormDefaultValues.icon);
    const [category, setCategory] = useState(
        amenity?.category ?? amenityFormDefaultValues.category,
    );
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);

        const parsed = amenityFormSchema.safeParse({ name, icon, category });
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? 'Check the form and try again.');
            return;
        }

        // Safe casts, not assumptions: `icon`/`category` are only ever set from the icon
        // grid / Select below, both populated from these exact allow-lists.
        const payload = {
            name: parsed.data.name,
            icon: parsed.data.icon as AmenityIconName,
            category: parsed.data.category as AmenityCategory,
        };

        setSubmitting(true);
        try {
            if (amenity) {
                await adminUpdateAmenity({ amenityId: amenity._id, ...payload });
                toast.success('Amenity updated');
            } else {
                await adminCreateAmenity(payload);
                toast.success('Amenity created');
            }
            onDone();
        } catch (thrown) {
            setError(errorToastMessage(thrown, 'Something went wrong saving this amenity.'));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>{amenity ? 'Edit amenity' : 'New amenity'}</DialogTitle>
            </DialogHeader>

            <div className='space-y-4 py-4'>
                <div className='space-y-1.5'>
                    <Label htmlFor='amenity-name'>Name</Label>
                    <Input
                        id='amenity-name'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div className='space-y-1.5'>
                    <Label htmlFor='amenity-category'>Category</Label>
                    <Select value={category} onValueChange={(value) => setCategory(value ?? '')}>
                        <SelectTrigger id='amenity-category' className='w-full'>
                            <SelectValue placeholder='Pick a category' />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(AMENITY_CATEGORY).map((value) => (
                                <SelectItem key={value} value={value}>
                                    {AMENITY_CATEGORY_LABELS[value]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='space-y-1.5'>
                    <Label>Icon</Label>
                    <div
                        role='radiogroup'
                        aria-label='Icon'
                        className='grid grid-cols-6 gap-2 sm:grid-cols-8'
                    >
                        {AMENITY_ICON_NAMES.map((iconName) => {
                            const Icon = AMENITY_ICON_BY_KEY[iconName];
                            const selected = icon === iconName;

                            return (
                                <button
                                    key={iconName}
                                    type='button'
                                    role='radio'
                                    aria-checked={selected}
                                    aria-label={iconName}
                                    onClick={() => setIcon(iconName)}
                                    className={cn(
                                        'flex size-9 items-center justify-center rounded-lg border transition-colors',
                                        selected
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {Icon && <Icon className='size-4' aria-hidden='true' />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && (
                    <p role='alert' className='text-sm text-destructive'>
                        {error}
                    </p>
                )}
            </div>

            <DialogFooter>
                <Button type='button' variant='ghost' disabled={submitting} onClick={onCancel}>
                    Cancel
                </Button>
                <Button type='submit' disabled={submitting}>
                    {submitting ? 'Saving…' : 'Save'}
                </Button>
            </DialogFooter>
        </form>
    );
}
