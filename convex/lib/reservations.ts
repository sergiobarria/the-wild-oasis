import { v } from 'convex/values';

/** Spec §65's reservation lifecycle. */
export const RESERVATION_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;

export type ReservationStatus = (typeof RESERVATION_STATUS)[keyof typeof RESERVATION_STATUS];

export const reservationStatusValidator = v.union(
    v.literal(RESERVATION_STATUS.PENDING),
    v.literal(RESERVATION_STATUS.CONFIRMED),
    v.literal(RESERVATION_STATUS.COMPLETED),
    v.literal(RESERVATION_STATUS.CANCELLED),
);

/** Spec §66's payment lifecycle, a concept separate from `ReservationStatus` -- a demo
 *  reservation is `confirmed` + `not_required` at the same time. */
export const PAYMENT_STATUS = {
    NOT_REQUIRED: 'not_required',
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const paymentStatusValidator = v.union(
    v.literal(PAYMENT_STATUS.NOT_REQUIRED),
    v.literal(PAYMENT_STATUS.PENDING),
    v.literal(PAYMENT_STATUS.PAID),
    v.literal(PAYMENT_STATUS.FAILED),
    v.literal(PAYMENT_STATUS.REFUNDED),
);

/** The only statuses that can occupy a cabin's calendar (spec §32) -- mirrors
 *  `features/availability/availability-domain.ts`'s `BLOCKING_RESERVATION_STATUSES`, kept in
 *  sync by this module's own test. */
export function isBlockingStatus(status: ReservationStatus): boolean {
    return status === RESERVATION_STATUS.PENDING || status === RESERVATION_STATUS.CONFIRMED;
}
