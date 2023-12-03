import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
    Button,
    Form,
    FormControl,
    // FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Textarea,
} from '@/components/ui';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCabin } from '@/services/cabins';

const schema = z.object({
    name: z
        .string({
            required_error: 'Cabin name is required',
        })
        .min(3, {
            message: 'Cabin name must be at least 3 characters',
        })
        .max(50, {
            message: 'Cabin name must be at most 50 characters',
        }),
    max_capacity: z.coerce
        .number({
            required_error: 'Maximum capacity is required',
        })
        .min(1, {
            message: 'Maximum capacity must be at least 1',
        }),
    regular_price: z.coerce
        .number({
            required_error: 'Regular price is required',
        })
        .min(1, {
            message: 'Regular price must be at least 1',
        }),
    discount: z.coerce.number().optional(),
    description: z.string().optional(),
    image: z.any().refine(files => files?.length === 1, 'Image is required.'),
});

type FormValues = z.infer<typeof schema>;

export function CreateCabinForm() {
    const queryClient = useQueryClient();
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            max_capacity: 2,
            regular_price: 100,
            discount: 0,
            description: '',
            // image_url: '',
        },
    });
    const { isPending, mutate } = useMutation({
        mutationFn: createCabin,
        onSuccess: () => {
            toast.success('Cabin created successfully');
            queryClient.invalidateQueries({
                queryKey: ['cabins'],
            });

            form.reset();
        },
        onError: error => {
            console.error(error);
            toast.error('Something went wrong');
        },
    });

    function onSubmit(data: FormValues) {
        console.log(data);
        mutate({ ...data, image: data.image[0] });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cabin Name*</FormLabel>
                            <FormControl>
                                <Input placeholder="001" {...field} />
                            </FormControl>
                            {/* <FormDescription className="text-xs italic">
                                This is the cabin name
                            </FormDescription> */}
                            <FormMessage className="text-xs font-normal italic" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="max_capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maximum Capacity*</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="2" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs font-normal italic" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="regular_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Regular Price*</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs font-normal italic" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="10" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs font-normal italic" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea rows={5} placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs font-normal italic" />
                        </FormItem>
                    )}
                />

                <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    {...form.register('image', { required: 'this field is required' })}
                />
                {form.formState.errors.image && (
                    <span className="text-xs text-red-500">
                        {form.formState.errors.image.message as string}
                    </span>
                )}

                <div className="flex items-center justify-end gap-6">
                    <Button variant="outline" type="button" onClick={() => form.reset()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        Save Cabin
                    </Button>
                </div>
            </form>
        </Form>
    );
}
