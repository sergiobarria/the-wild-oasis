/**
 * Uniform across every cabin, not per-cabin data -- deliberately not in the schema. If this
 * ever needs to vary by cabin, that's the signal to promote it into `convex/schema.ts`.
 */
export const CABIN_POLICIES = {
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    rules: [
        'No smoking inside any cabin',
        'No parties or events',
        'Quiet hours from 10 PM to 8 AM',
        'Well-behaved pets welcome where noted in amenities',
    ],
} as const;
