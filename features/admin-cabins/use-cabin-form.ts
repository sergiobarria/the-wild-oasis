import { useForm } from '@tanstack/react-form';

import { cabinFormSchema, type CabinFormValues } from './cabin-form-domain';

/**
 * Both the create and edit forms instantiate `useForm` identically (same schema, same
 * `CabinFormValues` shape) -- sharing this hook means `CabinFormApi` below is a single,
 * accurately-inferred type instead of a hand-written generic signature copied from
 * `@tanstack/react-form`'s internals (which spans a dozen type parameters).
 */
export function useCabinForm(
    defaultValues: CabinFormValues,
    onSubmit: (args: { value: CabinFormValues }) => void | Promise<void>,
) {
    return useForm({
        defaultValues,
        validators: { onChange: cabinFormSchema },
        onSubmit,
    });
}

export type CabinFormApi = ReturnType<typeof useCabinForm>;
