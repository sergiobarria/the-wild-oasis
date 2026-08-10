'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AuthFormField } from '@/features/auth/components/auth-form-field';

import { slugify } from '../cabin-form-domain';
import type { CabinFormApi } from '../use-cabin-form';

export function CabinBasicTab({
    form,
    slugError,
}: {
    form: CabinFormApi;
    slugError?: string | null;
}) {
    return (
        <div className='space-y-4'>
            <form.Field name='name'>
                {(field) => <AuthFormField field={field} label='Name' />}
            </form.Field>

            <form.Field name='slug'>
                {(field) => (
                    <div>
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
                            <div className='flex-1'>
                                <AuthFormField
                                    field={field}
                                    label='Slug'
                                    helperText='Changing the slug after publishing breaks existing links -- no redirects exist.'
                                />
                            </div>
                            <Button
                                type='button'
                                variant='outline'
                                className='shrink-0'
                                onClick={() =>
                                    field.handleChange(
                                        slugify(form.getFieldValue('name') as string),
                                    )
                                }
                            >
                                Generate from name
                            </Button>
                        </div>
                        {slugError && (
                            <p role='alert' className='mt-1 text-xs text-destructive'>
                                {slugError}
                            </p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name='shortDescription'>
                {(field) => <AuthFormField field={field} label='Short description' />}
            </form.Field>

            <form.Field name='description'>
                {(field) => {
                    const errors = field.state.meta.errors;
                    const hasError = errors.length > 0 && field.state.meta.isTouched;

                    return (
                        <div className='space-y-1.5'>
                            <Label htmlFor={field.name}>Description</Label>
                            <Textarea
                                id={field.name}
                                name={field.name}
                                rows={5}
                                value={field.state.value as string}
                                aria-invalid={hasError}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                            />
                            {hasError && (
                                <p className='text-xs text-destructive'>
                                    {errors.map(String).join(', ')}
                                </p>
                            )}
                        </div>
                    );
                }}
            </form.Field>

            <form.Field name='location'>
                {(field) => <AuthFormField field={field} label='Location' />}
            </form.Field>

            <form.Field name='address'>
                {(field) => (
                    <AuthFormField
                        field={field}
                        label='Address (optional)'
                        helperText='Internal only -- never shown to guests.'
                    />
                )}
            </form.Field>

            <div className='flex gap-6'>
                <form.Field name='published'>
                    {(field) => (
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                id={field.name}
                                checked={field.state.value as boolean}
                                onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                            />
                            <Label htmlFor={field.name}>Published</Label>
                        </div>
                    )}
                </form.Field>

                <form.Field name='featured'>
                    {(field) => (
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                id={field.name}
                                checked={field.state.value as boolean}
                                onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                            />
                            <Label htmlFor={field.name}>Featured on home page</Label>
                        </div>
                    )}
                </form.Field>
            </div>
        </div>
    );
}
