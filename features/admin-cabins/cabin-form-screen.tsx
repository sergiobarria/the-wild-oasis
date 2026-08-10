'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation, useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { dollarsToCents } from '@/lib/money';
import { adminCabinEditHref, APP_ROUTES } from '@/lib/routes';

import { cabinFormDefaultValues, type CabinFormValues } from './cabin-form-domain';
import { CabinAmenitiesTab } from './components/cabin-amenities-tab';
import { CabinAvailabilityBlocks } from './components/cabin-availability-blocks';
import { CabinBasicTab } from './components/cabin-basic-tab';
import { CabinImagesTab } from './components/cabin-images-tab';
import { CabinPricingTab } from './components/cabin-pricing-tab';
import type { CabinFormApi } from './use-cabin-form';
import { useCabinForm } from './use-cabin-form';

function toMutationArgs(values: CabinFormValues) {
    return {
        name: values.name.trim(),
        slug: values.slug.trim(),
        shortDescription: values.shortDescription.trim(),
        description: values.description.trim(),
        location: values.location.trim(),
        address: values.address.trim() || undefined,
        nightlyRate: dollarsToCents(Number(values.nightlyRate)),
        cleaningFee: dollarsToCents(Number(values.cleaningFee)),
        maxGuests: Number(values.maxGuests),
        bedrooms: Number(values.bedrooms),
        beds: Number(values.beds),
        bathrooms: Number(values.bathrooms),
        amenityIds: values.amenityIds as Id<'amenities'>[],
        published: values.published,
        featured: values.featured,
    };
}

function errorMessage(thrown: unknown, fallback: string): string {
    return thrown instanceof ConvexError && typeof thrown.data === 'string'
        ? thrown.data
        : fallback;
}

/** Shared by the create and edit forms -- same tabs, same error/submit chrome, differing only
 *  in the images tab's content and the submit button's label. */
function CabinFormFields({
    form,
    slugError,
    formError,
    imagesTab,
    belowTabs,
    submitLabel,
    submittingLabel,
}: {
    form: CabinFormApi;
    slugError: string | null;
    formError: string | null;
    imagesTab: React.ReactNode;
    belowTabs?: React.ReactNode;
    submitLabel: string;
    submittingLabel: string;
}) {
    return (
        <form
            className='space-y-6'
            onSubmit={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                await form.handleSubmit();
            }}
        >
            <Tabs defaultValue='basic'>
                <TabsList>
                    <TabsTrigger value='basic'>Basic</TabsTrigger>
                    <TabsTrigger value='pricing'>Pricing</TabsTrigger>
                    <TabsTrigger value='amenities'>Amenities</TabsTrigger>
                    <TabsTrigger value='images'>Images</TabsTrigger>
                </TabsList>
                <TabsContent value='basic'>
                    <CabinBasicTab form={form} slugError={slugError} />
                </TabsContent>
                <TabsContent value='pricing'>
                    <CabinPricingTab form={form} />
                </TabsContent>
                <TabsContent value='amenities'>
                    <CabinAmenitiesTab form={form} />
                </TabsContent>
                <TabsContent value='images'>{imagesTab}</TabsContent>
            </Tabs>

            {belowTabs}

            {formError && (
                <p role='alert' className='text-sm text-destructive'>
                    {formError}
                </p>
            )}

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                    <Button type='submit' disabled={!canSubmit || isSubmitting}>
                        {isSubmitting ? submittingLabel : submitLabel}
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}

function CreateCabinForm() {
    const router = useRouter();
    const adminCreateCabin = useMutation(api.cabins.adminCreateCabin);
    const [coverStorageId, setCoverStorageId] = useState<Id<'_storage'> | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [slugError, setSlugError] = useState<string | null>(null);

    const form = useCabinForm(cabinFormDefaultValues, async ({ value }) => {
        setFormError(null);
        setSlugError(null);

        if (!coverStorageId) {
            setFormError('Upload a cover image before creating the cabin.');
            return;
        }

        try {
            const cabinId = await adminCreateCabin({
                ...toMutationArgs(value),
                coverImage: coverStorageId,
            });
            toast.success('Cabin created');
            router.push(adminCabinEditHref(cabinId) as never);
        } catch (thrown) {
            const message = errorMessage(thrown, 'Something went wrong creating the cabin.');
            if (message.toLowerCase().includes('slug')) {
                setSlugError(message);
            } else {
                setFormError(message);
            }
        }
    });

    return (
        <CabinFormFields
            form={form}
            slugError={slugError}
            formError={formError}
            submitLabel='Create cabin'
            submittingLabel='Creating…'
            imagesTab={
                <CabinImagesTab
                    mode='create'
                    coverStorageId={coverStorageId}
                    onCoverUploaded={setCoverStorageId}
                />
            }
        />
    );
}

type AdminCabinDetail = NonNullable<
    Awaited<ReturnType<typeof useQuery<typeof api.cabins.adminGetCabin>>>
>;

function EditCabinForm({ cabinId }: { cabinId: Id<'cabins'> }) {
    const cabin = useQuery(api.cabins.adminGetCabin, { cabinId });

    if (cabin === undefined) {
        return (
            <div className='space-y-2'>
                {Array.from({ length: 6 }, (_, index) => (
                    <Skeleton key={index} className='h-10 w-full' />
                ))}
            </div>
        );
    }

    if (cabin === null) {
        return <p className='text-muted-foreground'>This cabin could not be found.</p>;
    }

    // A separate component, mounted only once `cabin` is loaded -- `useCabinForm`'s
    // `defaultValues` are only read on the form's first render, so initializing it while
    // `cabin` was still `undefined` would permanently freeze every field empty.
    return <EditCabinFormBody cabinId={cabinId} cabin={cabin} />;
}

function EditCabinFormBody({ cabinId, cabin }: { cabinId: Id<'cabins'>; cabin: AdminCabinDetail }) {
    const adminUpdateCabin = useMutation(api.cabins.adminUpdateCabin);
    const [formError, setFormError] = useState<string | null>(null);
    const [slugError, setSlugError] = useState<string | null>(null);

    const form = useCabinForm(
        {
            name: cabin.name,
            slug: cabin.slug,
            shortDescription: cabin.shortDescription,
            description: cabin.description,
            location: cabin.location,
            address: cabin.address ?? '',
            nightlyRate: String(cabin.nightlyRate / 100),
            cleaningFee: String(cabin.cleaningFee / 100),
            maxGuests: String(cabin.maxGuests),
            bedrooms: String(cabin.bedrooms),
            beds: String(cabin.beds),
            bathrooms: String(cabin.bathrooms),
            amenityIds: cabin.amenityIds,
            published: cabin.published,
            featured: cabin.featured,
        },
        async ({ value }) => {
            setFormError(null);
            setSlugError(null);

            try {
                await adminUpdateCabin({ cabinId, ...toMutationArgs(value) });
                toast.success('Cabin saved');
            } catch (thrown) {
                const message = errorMessage(thrown, 'Something went wrong saving the cabin.');
                if (message.toLowerCase().includes('slug')) {
                    setSlugError(message);
                } else {
                    setFormError(message);
                }
            }
        },
    );

    return (
        <CabinFormFields
            form={form}
            slugError={slugError}
            formError={formError}
            submitLabel='Save changes'
            submittingLabel='Saving…'
            imagesTab={
                <CabinImagesTab
                    mode='edit'
                    cabinId={cabinId}
                    coverImageUrl={cabin.coverImageUrl}
                    gallery={cabin.gallery}
                />
            }
            belowTabs={<CabinAvailabilityBlocks cabinId={cabinId} />}
        />
    );
}

export function CabinFormScreen(props: { mode: 'create' } | { mode: 'edit'; cabinId: string }) {
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='font-heading text-2xl font-medium'>
                    {props.mode === 'create' ? 'New cabin' : 'Edit cabin'}
                </h1>
                <Button variant='ghost' render={<Link href={APP_ROUTES.ADMIN_CABINS} />}>
                    Back to cabins
                </Button>
            </div>

            {props.mode === 'create' ? (
                <CreateCabinForm />
            ) : (
                <EditCabinForm cabinId={props.cabinId as Id<'cabins'>} />
            )}
        </div>
    );
}
