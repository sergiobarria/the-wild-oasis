import React from 'react'

import { useNavigate } from '@tanstack/react-router'

import { CalendarIcon, CheckIcon } from 'lucide-react'

import { Typography } from '@/components/shared/typography'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Item } from '@/components/ui/item'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { bookingConfig } from '@/config/booking'

import { useBooking } from '../hooks/use-booking'
import { DateRange } from '../types'

interface BookingCardProps {
    cabinId: string
    pricePerNight: number
    discountPercentage?: number
}

export function BookingCard({ cabinId, pricePerNight, discountPercentage }: BookingCardProps) {
    const [open, setOpen] = React.useState(false)
    const [dateRange, setDateRange] = React.useState<DateRange>({ start: undefined, end: undefined })
    const [guests, setGuests] = React.useState<number>(2)

    const navigate = useNavigate()

    const { priceBreakdown, validation, formatPrice, formattedCheckinDate, formattedCheckoutDate, isReadyToBook } =
        useBooking({ range: dateRange, guests, pricePerNight, discountPercentage })

    const handleBook = () => {
        if (!isReadyToBook || !dateRange.start || !dateRange.end || !guests) return

        navigate({
            to: '/checkout/summary',
            search: {
                cabinId,
                guests,
                checkIn: dateRange.start.toISOString(),
                checkOut: dateRange.end.toISOString(),
            },
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                    Pick your dates
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" id="date" className="w-full justify-between font-normal">
                            {dateRange.start && dateRange.end
                                ? `${formattedCheckinDate} - ${formattedCheckoutDate}`
                                : 'Select dates'}
                            <CalendarIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={{
                                from: dateRange.start,
                                to: dateRange.end,
                            }}
                            numberOfMonths={2}
                            disabled={(date) => date < new Date()}
                            onSelect={(range) => {
                                setDateRange({ start: range?.from, end: range?.to })
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col gap-3">
                <Label htmlFor="guests" className="px-1">
                    Number of guests
                </Label>
                <Input
                    id="guests"
                    name="guests"
                    type="number"
                    min={1}
                    max={bookingConfig.maxGuests}
                    placeholder="2"
                    value={guests}
                    onChange={(e) => {
                        const value = e.target.value
                        setGuests(parseInt(value, 10))
                    }}
                />
            </div>

            {/* Booking Estimate */}
            {priceBreakdown ? (
                <Item className="bg-muted/30">
                    <div className="w-full space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Check-in:</span>
                            <span>{formattedCheckinDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Check-out:</span>
                            <span>{formattedCheckoutDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Nights:</span>
                            <span>{priceBreakdown.nights}</span>
                        </div>
                    </div>

                    <Separator />

                    <Typography
                        variant="h4"
                        className="text-primary mb-0 flex w-full items-center justify-between text-center text-xl font-semibold"
                    >
                        <span>Estimated Total:</span>
                        <span>${formatPrice(priceBreakdown.totalPrice)}</span>
                    </Typography>
                    <Typography variant="body" className="text-muted-foreground mb-0 text-sm">
                        The final price and detailed breakdown will be shown before completing your reservation.
                    </Typography>
                </Item>
            ) : (
                <Item className="bg-muted/30">
                    <Typography variant="body" className="text-muted-foreground mb-0 text-sm">
                        Select valid dates and number of guests to see the estimated total.
                    </Typography>
                </Item>
            )}

            {/* Validation Errors */}
            {!validation.isValid && (dateRange.start || dateRange.end || guests) && (
                <div className="border-destructive bg-destructive/10 space-y-1 rounded-lg border p-3">
                    <Typography size="sm" className="text-destructive m-0 pb-2 font-semibold">
                        There are some issues with your booking
                    </Typography>
                    {validation.errors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <CheckIcon className="text-destructive size-4" />
                            <Typography size="sm" className="text-destructive m-0 p-0">
                                {error}
                            </Typography>
                        </div>
                    ))}
                </div>
            )}

            <Button type="button" className="w-full" disabled={!isReadyToBook} onClick={handleBook}>
                {isReadyToBook ? 'Book this cabin' : 'Select dates and guests'}
            </Button>
        </div>
    )
}
