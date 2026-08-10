'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import { Label } from '@/components/ui/label';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

type CreateModeProps = {
    mode: 'create';
    coverStorageId: Id<'_storage'> | null;
    onCoverUploaded: (storageId: Id<'_storage'>) => void;
};

type EditModeProps = {
    mode: 'edit';
    coverImageUrl: string | null;
    galleryImageUrls: (string | null)[];
};

export function CabinImagesTab(props: CreateModeProps | EditModeProps) {
    const generateUploadUrl = useMutation(api.cabins.adminGenerateUploadUrl);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (props.mode === 'edit') {
        return (
            <div className='space-y-4'>
                <div className='space-y-1.5'>
                    <Label>Cover image</Label>
                    {props.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- signed Convex storage URL, not a static asset.
                        <img
                            src={props.coverImageUrl}
                            alt=''
                            className='h-32 w-48 rounded-md object-cover'
                        />
                    ) : (
                        <p className='text-sm text-muted-foreground'>No cover image.</p>
                    )}
                </div>

                {props.galleryImageUrls.length > 0 && (
                    <div className='space-y-1.5'>
                        <Label>Gallery</Label>
                        <div className='flex flex-wrap gap-2'>
                            {props.galleryImageUrls.map(
                                (url, index) =>
                                    url && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={index}
                                            src={url}
                                            alt=''
                                            className='h-20 w-28 rounded-md object-cover'
                                        />
                                    ),
                            )}
                        </div>
                    </div>
                )}

                <p className='text-sm text-muted-foreground'>
                    Uploading, reordering, and removing images arrives in a later update.
                </p>
            </div>
        );
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file || props.mode !== 'create') return;

        setError(null);
        setUploading(true);

        try {
            const uploadUrl = await generateUploadUrl();
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: { 'Content-Type': file.type },
                body: file,
            });

            if (!response.ok) throw new Error('Upload failed.');

            const { storageId } = (await response.json()) as { storageId: Id<'_storage'> };
            props.onCoverUploaded(storageId);
            toast.success('Cover image uploaded');
        } catch {
            setError('Something went wrong uploading the image. Please try again.');
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className='space-y-1.5'>
            <Label htmlFor='cover-image'>Cover image</Label>
            <input
                id='cover-image'
                type='file'
                accept='image/*'
                disabled={uploading}
                onChange={handleFileChange}
            />
            {uploading && <p className='text-sm text-muted-foreground'>Uploading…</p>}
            {props.coverStorageId && !uploading && (
                <p className='text-sm text-muted-foreground'>Cover image ready.</p>
            )}
            {error && (
                <p role='alert' className='text-sm text-destructive'>
                    {error}
                </p>
            )}
            <p className='text-xs text-muted-foreground'>
                A cover image is required to create a cabin. Gallery images can be added after
                saving.
            </p>
        </div>
    );
}
