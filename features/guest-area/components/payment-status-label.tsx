import type { PaymentStatus } from '@/convex/lib/reservations';

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    not_required: 'Not required',
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
};

/** Shared by the bookings list row and its detail dialog so the label wording can't drift
 *  between the two -- spec §45 lists payment status as a field the booking history (not just
 *  the detail view) should display. */
export function paymentStatusLabel(status: PaymentStatus): string {
    return PAYMENT_STATUS_LABELS[status];
}
