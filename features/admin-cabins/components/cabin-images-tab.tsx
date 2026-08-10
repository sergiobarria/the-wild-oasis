'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

type GalleryImage = { storageId: Id<'_storage'>; url: string | null };

type CreateModeProps = {
    mode: 'create';
    coverStorageId: Id<'_storage'> | null;
    onCoverUploaded: (storageId: Id<'_storage'>) => void;
};

type EditModeProps = {
    mode: 'edit';
    cabinId: Id<'cabins'>;
    coverImage: GalleryImage;
    gallery: GalleryImage[];
};

async function uploadFile(
    file: File,
    generateUploadUrl: () => Promise<string>,
): Promise<Id<'_storage'>> {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
    });

    if (!response.ok) throw new Error('Upload failed.');

    const { storageId } = (await response.json()) as { storageId: Id<'_storage'> };
    return storageId;
}

function EditImages({ cabinId, coverImage, gallery }: EditModeProps) {
    const generateUploadUrl = useMutation(api.cabins.adminGenerateUploadUrl);
    const adminSetCoverImage = useMutation(api.cabins.adminSetCoverImage);
    const adminSetGalleryImages = useMutation(api.cabins.adminSetGalleryImages);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);

        try {
            const storageId = await uploadFile(file, generateUploadUrl);
            await adminSetCoverImage({ cabinId, storageId });
            toast.success('Cover image updated');
        } catch {
            setError('Something went wrong uploading the cover image. Please try again.');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    }

    async function handleGalleryAdd(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;

        setError(null);
        setUploading(true);

        try {
            const uploaded = await Promise.all(
                files.map((file) => uploadFile(file, generateUploadUrl)),
            );
            await adminSetGalleryImages({
                cabinId,
                storageIds: [...gallery.map((image) => image.storageId), ...uploaded],
            });
            toast.success('Gallery images added');
        } catch {
            setError('Something went wrong uploading one or more images. Please try again.');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    }

    async function handleRemove(storageId: Id<'_storage'>) {
        try {
            await adminSetGalleryImages({
                cabinId,
                storageIds: gallery
                    .filter((image) => image.storageId !== storageId)
                    .map((image) => image.storageId),
            });
        } catch {
            toast.error('Something went wrong removing this image.');
        }
    }

    async function handleReorder(index: number, direction: -1 | 1) {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= gallery.length) return;

        const reordered = [...gallery.map((image) => image.storageId)];
        [reordered[index], reordered[nextIndex]] = [reordered[nextIndex]!, reordered[index]!];

        try {
            await adminSetGalleryImages({ cabinId, storageIds: reordered });
        } catch {
            toast.error('Something went wrong reordering the gallery.');
        }
    }

    async function handleSetAsCover(storageId: Id<'_storage'>) {
        try {
            await adminSetCoverImage({ cabinId, storageId });
            toast.success('Cover image updated');
        } catch {
            toast.error('Something went wrong updating the cover image.');
        }
    }

    return (
        <div className='space-y-6'>
            <div className='space-y-1.5'>
                <Label htmlFor='cover-image-replace'>Cover image</Label>
                {coverImage.url && (
                    // eslint-disable-next-line @next/next/no-img-element -- signed Convex storage URL, not a static asset.
                    <img
                        src={coverImage.url}
                        alt=''
                        className='h-32 w-48 rounded-md object-cover'
                    />
                )}
                <input
                    id='cover-image-replace'
                    type='file'
                    accept='image/*'
                    disabled={uploading}
                    onChange={handleCoverChange}
                />
            </div>

            <div className='space-y-1.5'>
                <Label htmlFor='gallery-images-add'>Gallery</Label>
                {gallery.length > 0 && (
                    <div className='flex flex-wrap gap-3'>
                        {gallery.map((image, index) => (
                            <div key={image.storageId} className='space-y-1'>
                                {image.url && (
                                    // eslint-disable-next-line @next/next/no-img-element -- signed Convex storage URL, not a static asset.
                                    <img
                                        src={image.url}
                                        alt=''
                                        className='h-20 w-28 rounded-md object-cover'
                                    />
                                )}
                                <div className='flex items-center gap-1'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        aria-label='Move earlier'
                                        disabled={index === 0}
                                        onClick={() => handleReorder(index, -1)}
                                    >
                                        <ArrowUpIcon className='size-3' />
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        aria-label='Move later'
                                        disabled={index === gallery.length - 1}
                                        onClick={() => handleReorder(index, 1)}
                                    >
                                        <ArrowDownIcon className='size-3' />
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        aria-label='Remove image'
                                        onClick={() => handleRemove(image.storageId)}
                                    >
                                        <XIcon className='size-3' />
                                    </Button>
                                </div>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => handleSetAsCover(image.storageId)}
                                >
                                    Set as cover
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                <input
                    id='gallery-images-add'
                    type='file'
                    accept='image/*'
                    multiple
                    disabled={uploading}
                    onChange={handleGalleryAdd}
                />
            </div>

            {uploading && <p className='text-sm text-muted-foreground'>Uploading…</p>}
            {error && (
                <p role='alert' className='text-sm text-destructive'>
                    {error}
                </p>
            )}
        </div>
    );
}

function CreateCoverUpload(props: CreateModeProps) {
    const generateUploadUrl = useMutation(api.cabins.adminGenerateUploadUrl);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);

        try {
            const storageId = await uploadFile(file, generateUploadUrl);
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

export function CabinImagesTab(props: CreateModeProps | EditModeProps) {
    if (props.mode === 'edit') return <EditImages {...props} />;
    return <CreateCoverUpload {...props} />;
}
