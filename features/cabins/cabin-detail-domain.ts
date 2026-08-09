/** Native `<input type="date">` values, ISO `YYYY-MM-DD` strings -- 0 for any incomplete range. */
export function nightsBetween(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 0;

    const nights = Math.round(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (24 * 60 * 60 * 1000),
    );

    return Math.max(0, nights);
}

/**
 * Spec §31's formula (nightly rate x nights + cleaning fee), minus the optional taxes line --
 * no tax-rate config exists in the schema, a documented simplification. Integer cents in,
 * integer cents out.
 */
export function calculateTotalCents(
    nightlyRate: number,
    cleaningFee: number,
    nights: number,
): number {
    if (nights <= 0) return 0;

    return nightlyRate * nights + cleaningFee;
}
