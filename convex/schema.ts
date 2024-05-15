import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	cabins: defineTable({
		name: v.string(),
		maxCapacity: v.number(),
		price: v.number(),
		discount: v.number(),
		description: v.string(),
		image: v.optional(v.string()),
	}),
	guests: defineTable({
		fullName: v.string(),
		email: v.string(),
		nationalID: v.string(),
		nationality: v.string(),
		countryFlag: v.string(),
		phoneNumber: v.string(),
	}),
	settings: defineTable({
		minBookingDays: v.number(),
		maxBookingDays: v.number(),
		maxGuestsPerCabin: v.number(),
		breakfastPrice: v.number(),
	}),
	bookings: defineTable({
		cabinId: v.id('cabins'),
		guestId: v.id('guests'),
		startDate: v.string(),
		endDate: v.string(),
		numberOfDays: v.number(),
		numberOfGuests: v.number(),
		cabinPrice: v.number(),
		extrasPrice: v.number(),
		totalPrice: v.number(),
		status: v.string(),
		hasBreakfast: v.boolean(),
		isPaid: v.boolean(),
		observations: v.string(),
	}),
})
