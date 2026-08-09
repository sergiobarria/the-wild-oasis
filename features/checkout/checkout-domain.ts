import { calculateTotalCents, nightsBetween } from '@/lib/pricing';

export type PricingBreakdown = {
    nights: number;
    nightlySubtotal: number;
    cleaningFee: number;
    taxes: number;
    total: number;
};

/** The same formula the demo reservation mutation computes server-side (spec §31) -- this is
 *  the display-only mirror, never the value actually stored; the mutation always recomputes
 *  its own total rather than trusting whatever this function showed the guest. */
export function pricingBreakdown(params: {
    nightlyRate: number;
    cleaningFee: number;
    checkIn: string;
    checkOut: string;
}): PricingBreakdown {
    const nights = nightsBetween(params.checkIn, params.checkOut);
    const taxes = 0; // No tax engine exists yet (spec §4).

    return {
        nights,
        nightlySubtotal: params.nightlyRate * nights,
        cleaningFee: params.cleaningFee,
        taxes,
        total: calculateTotalCents(params.nightlyRate, params.cleaningFee, nights) + taxes,
    };
}
