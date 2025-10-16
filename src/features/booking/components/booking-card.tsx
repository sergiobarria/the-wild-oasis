import React from 'react'

import { useForm, useStore } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { CalendarIcon } from 'lucide-react'

import { Typography } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Item } from '@/components/ui/item'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { DEFAULT_DEBOUNCE_DELAY } from '@/config/constants'

import { calculateBookingPrice, calculateNights, formatBookingDate, formatPrice } from '../calculations'
import { BookingFormSchema } from '../schemas'

interface BookingCardProps {
    cabinId: string
    pricePerNight: number
    discountPercentage?: number
}

export function BookingCard({ cabinId, pricePerNight, discountPercentage }: BookingCardProps) {
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: {
            checkIn: undefined as Date | undefined,
            checkOut: undefined as Date | undefined,
            guests: undefined as number | undefined,
        },
        validators: {
            onChangeAsync: BookingFormSchema,
            onChangeAsyncDebounceMs: DEFAULT_DEBOUNCE_DELAY,
        },
        onSubmit: async ({ value }) => {
            if (!value.checkIn || !value.checkOut || !value.guests) return

            navigate({
                to: '/checkout/summary',
                search: {
                    cabinId,
                    checkIn: value.checkIn.toISOString(),
                    checkOut: value.checkOut.toISOString(),
                    guests: value.guests,
                },
            })
        },
    })

    const checkIn = useStore(form.store, (state) => state.values.checkIn)
    const checkOut = useStore(form.store, (state) => state.values.checkOut)
    const guests = useStore(form.store, (state) => state.values.guests)

    const priceBreakdown = React.useMemo(() => {
        if (!checkIn || !checkOut || !guests) return null

        return calculateBookingPrice({
            dateRange: { start: checkIn, end: checkOut },
            guests,
            pricePerNight,
            discountPercentage,
        })
    }, [checkIn, checkOut, guests, pricePerNight, discountPercentage])

    const nights = React.useMemo(() => {
        if (!checkIn || !checkOut) return 0

        return calculateNights({ start: checkIn, end: checkOut })
    }, [checkIn, checkOut])

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                form.handleSubmit()
            }}
            className="space-y-6"
        >
            {/* Date Range Picker */}
            <form.Field name="checkIn">
                {(checkInField) => (
                    <form.Field name="checkOut">
                        {(checkOutField) => (
                            <Field
                                data-invalid={
                                    checkInField.state.meta.errors.length > 0 ||
                                    checkOutField.state.meta.errors.length > 0
                                }
                            >
                                <FieldLabel>Pick your dates</FieldLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between font-normal"
                                            type="button"
                                        >
                                            {checkInField.state.value && checkOutField.state.value
                                                ? `${formatBookingDate(checkInField.state.value)} - ${formatBookingDate(checkOutField.state.value)}`
                                                : 'Select dates'}
                                            <CalendarIcon className="size-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="range"
                                            selected={{
                                                from: checkInField.state.value,
                                                to: checkOutField.state.value,
                                            }}
                                            onSelect={(range) => {
                                                checkInField.handleChange(range?.from)
                                                checkOutField.handleChange(range?.to)
                                            }}
                                            numberOfMonths={2}
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FieldError
                                    errors={[...checkInField.state.meta.errors, ...checkOutField.state.meta.errors]}
                                />
                            </Field>
                        )}
                    </form.Field>
                )}
            </form.Field>

            {/* Guests Input */}
            <form.Field name="guests">
                {(field) => (
                    <Field data-invalid={field.state.meta.errors.length > 0}>
                        <FieldLabel htmlFor="guests">Number of guests</FieldLabel>
                        <Input
                            id="guests"
                            name="guests"
                            type="number"
                            placeholder="Enter number of guests"
                            value={field.state.value ?? ''}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                                const value = e.target.value
                                field.handleChange(value ? parseInt(value, 10) : undefined)
                            }}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            </form.Field>

            {/* Price Breakdown */}
            {priceBreakdown ? (
                <Item className="bg-muted/30">
                    <div className="w-full space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Check-in:</span>
                            <span>{formatBookingDate(checkIn)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Check-out:</span>
                            <span>{formatBookingDate(checkOut)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Nights:</span>
                            <span>{nights}</span>
                        </div>
                        {priceBreakdown.discount > 0 && (
                            <div className="flex items-center justify-between text-green-600">
                                <span>Discount ({discountPercentage}%):</span>
                                <span>-{formatPrice(priceBreakdown.discount)}</span>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <Typography
                        variant="h4"
                        className="text-primary mb-0 flex w-full items-center justify-between text-xl font-semibold"
                    >
                        <span>Estimated Total:</span>
                        <span>{formatPrice(priceBreakdown.totalPrice)}</span>
                    </Typography>
                    <Typography variant="body" className="text-muted-foreground mb-0 text-sm">
                        Full breakdown will be shown before completing your reservation.
                    </Typography>
                </Item>
            ) : (
                <Item className="bg-muted/30">
                    <Typography variant="body" className="text-muted-foreground mb-0 text-center text-sm">
                        Select your dates and guests to see estimated total
                    </Typography>
                </Item>
            )}

            {/* Submit Button */}
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Reserve'}
                    </Button>
                )}
            />
        </form>
    )
}
