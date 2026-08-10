'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
    cabinId: Id<'cabins'>;
    coverImageUrl: string | null;
    gallery: (string | null)[];
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

function EditImages({ cabinId, coverImageUrl, gallery }: EditModeProps) {
    const generateUploadUrl = useMutation(api.cabins.adminGenerateUploadUrl);
    const adminSetCoverImage = useMutation(api.cabins.adminSetCoverImage);
    const adminSetCoverImageFromGallery = useMutation(api.cabins.adminSetCoverImageFromGallery);
    const adminAddGalleryImages = useMutation(api.cabins.adminAddGalleryImages);
    const adminRemoveGalleryImage = useMutation(api.cabins.adminRemoveGalleryImage);
    const adminReorderGalleryImage = useMutation(api.cabins.adminReorderGalleryImage);

    // A single in-flight flag covers every gallery action (upload, remove, reorder, set-as-
    // cover) -- these all read-then-write the same `galleryImages` array server-side, so
    // letting two fire concurrently from this component risks the second call overwriting the
    // first's effect. Disabling every control while any one is pending closes that window.
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function runAction(action: () => Promise<unknown>, errorMessage: string) {
        setError(null);
        setPending(true);
        try {
            await action();
        } catch {
            setError(errorMessage);
        } finally {
            setPending(false);
        }
    }

    async function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        await runAction(async () => {
            const storageId = await uploadFile(file, generateUploadUrl);
            await adminSetCoverImage({ cabinId, storageId });
            toast.success('Cover image updated');
        }, 'Something went wrong uploading the cover image. Please try again.');
        event.target.value = '';
    }

    async function handleGalleryAdd(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;

        await runAction(async () => {
            const uploaded = await Promise.all(
                files.map((file) => uploadFile(file, generateUploadUrl)),
            );
            await adminAddGalleryImages({ cabinId, storageIds: uploaded });
            toast.success('Gallery images added');
        }, 'Something went wrong uploading one or more images. Please try again.');
        event.target.value = '';
    }

    async function handleRemove(index: number) {
        await runAction(
            () => adminRemoveGalleryImage({ cabinId, index }),
            'Something went wrong removing this image.',
        );
    }

    async function handleReorder(index: number, direction: -1 | 1) {
        const toIndex = index + direction;
        if (toIndex < 0 || toIndex >= gallery.length) return;

        await runAction(
            () => adminReorderGalleryImage({ cabinId, fromIndex: index, toIndex }),
            'Something went wrong reordering the gallery.',
        );
    }

    async function handleSetAsCover(index: number) {
        await runAction(async () => {
            await adminSetCoverImageFromGallery({ cabinId, index });
            toast.success('Cover image updated');
        }, 'Something went wrong updating the cover image.');
    }

    return (
        <div className='space-y-6'>
            <div className='space-y-1.5'>
                <Label htmlFor='cover-image-replace'>Cover image</Label>
                {coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- signed Convex storage URL, not a static asset.
                    <img src={coverImageUrl} alt='' className='h-32 w-48 rounded-md object-cover' />
                ) : (
                    <p className='text-sm text-muted-foreground'>No cover image.</p>
                )}
                <input
                    id='cover-image-replace'
                    type='file'
                    accept='image/*'
                    disabled={pending}
                    onChange={handleCoverChange}
                />
            </div>

            <div className='space-y-1.5'>
                <Label htmlFor='gallery-images-add'>Gallery</Label>
                {gallery.length > 0 && (
                    <div className='flex flex-wrap gap-3'>
                        {gallery.map((url, index) => (
                            // Position in the array is the only identity a gallery entry has on
                            // the client (the underlying storage id never reaches it) -- stable
                            // enough for this list, since every mutation re-reads the full,
                            // freshly-fetched array via `adminGetCabin` before the next render.
                            <div key={index} className='space-y-1'>
                                {url && (
                                    // eslint-disable-next-line @next/next/no-img-element -- signed Convex storage URL, not a static asset.
                                    <img
                                        src={url}
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
                                        disabled={pending || index === 0}
                                        onClick={() => handleReorder(index, -1)}
                                    >
                                        <ArrowUpIcon className='size-3' />
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        aria-label='Move later'
                                        disabled={pending || index === gallery.length - 1}
                                        onClick={() => handleReorder(index, 1)}
                                    >
                                        <ArrowDownIcon className='size-3' />
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        aria-label='Remove image'
                                        disabled={pending}
                                        onClick={() => handleRemove(index)}
                                    >
                                        <XIcon className='size-3' />
                                    </Button>
                                </div>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    disabled={pending}
                                    onClick={() => handleSetAsCover(index)}
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
                    disabled={pending}
                    onChange={handleGalleryAdd}
                />
            </div>

            {pending && <p className='text-sm text-muted-foreground'>Working…</p>}
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
