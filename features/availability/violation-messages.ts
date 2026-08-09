import type { AvailabilityViolation } from './availability-domain';

/** User-facing copy for each `AvailabilityViolation` code -- kept out of the domain module,
 *  which is shared client/server and owns no UI strings. */
export function violationMessage(violation: AvailabilityViolation): string {
    switch (violation.code) {
        case 'INVALID_RANGE':
            return 'Check-out must be after check-in.';
        case 'PAST_CHECK_IN':
            return 'Check-in can’t be in the past.';
        case 'INVALID_GUEST_COUNT':
            return 'Select at least 1 guest.';
        case 'GUESTS_EXCEED_CAPACITY':
            return 'This cabin can’t accommodate that many guests.';
        case 'DATE_UNAVAILABLE':
            return 'These dates are already booked. Try a different range.';
    }
}
