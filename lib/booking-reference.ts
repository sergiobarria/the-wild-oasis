/**
 * Convex document ids (e.g. `jh78djbk8dxmw21kd2vhp6r7t18c6ag0`) are opaque and long -- not
 * something to show a guest as "their" reservation reference. Deterministically derived from
 * the id (no schema change, no extra state to keep in sync) rather than a separately stored
 * field, since the id itself is already unique and permanent per reservation.
 */
export function formatBookingReference(reservationId: string): string {
    const tail = reservationId.slice(-8).toUpperCase();
    return `WO-${tail.slice(0, 4)}-${tail.slice(4)}`;
}
