'use client';

import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cabinsSearchHref } from '@/lib/routes';

import {
    availabilitySearchDefaultValues,
    availabilitySearchSchema,
    GUEST_OPTIONS,
} from '../home-domain';

export function AvailabilitySearchCard() {
    const router = useRouter();

    const form = useForm({
        defaultValues: availabilitySearchDefaultValues,
        validators: { onChange: availabilitySearchSchema },
        onSubmit: ({ value }) => {
            router.push(cabinsSearchHref(value) as Route);
        },
    });

    return (
        <Card className='shadow-lg'>
            <CardContent>
                <form
                    className='grid gap-4 sm:grid-cols-3 sm:items-end'
                    onSubmit={async (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        await form.handleSubmit();
                    }}
                >
                    <form.Field name='checkIn'>
                        {(field) => (
                            <div className='space-y-1.5'>
                                <Label htmlFor={field.name}>Check-in</Label>
                                <Input
                                    id={field.name}
                                    type='date'
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe selector={(state) => state.values.checkIn}>
                        {(checkIn) => (
                            <form.Field name='checkOut'>
                                {(field) => {
                                    const errors = field.state.meta.errors;
                                    const hasError =
                                        errors.length > 0 && field.state.meta.isTouched;

                                    return (
                                        <div className='space-y-1.5'>
                                            <Label htmlFor={field.name}>Check-out</Label>
                                            <Input
                                                id={field.name}
                                                type='date'
                                                min={checkIn || undefined}
                                                value={field.state.value}
                                                aria-invalid={hasError}
                                                onBlur={field.handleBlur}
                                                onChange={(event) =>
                                                    field.handleChange(event.target.value)
                                                }
                                            />
                                            {hasError && (
                                                <p className='text-xs text-destructive'>
                                                    Check-out must be after check-in.
                                                </p>
                                            )}
                                        </div>
                                    );
                                }}
                            </form.Field>
                        )}
                    </form.Subscribe>

                    <form.Field name='guests'>
                        {(field) => (
                            <div className='space-y-1.5'>
                                <Label htmlFor={field.name}>Guests</Label>
                                <Select
                                    value={field.state.value}
                                    onValueChange={(value) => field.handleChange(value ?? '')}
                                >
                                    <SelectTrigger id={field.name} className='w-full'>
                                        <SelectValue placeholder='Guests' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GUEST_OPTIONS.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option} {option === '1' ? 'guest' : 'guests'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <Button
                                type='submit'
                                className='sm:col-span-3'
                                disabled={!canSubmit || isSubmitting}
                            >
                                Check availability
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>
        </Card>
    );
}
