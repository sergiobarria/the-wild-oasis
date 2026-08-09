import { describe, expect, test } from 'vitest';

import { BLOCKING_RESERVATION_STATUSES } from '../../features/availability/availability-domain';
import { isBlockingStatus, RESERVATION_STATUS } from './reservations';

describe('isBlockingStatus', () => {
    test('pending and confirmed reservations block the calendar', () => {
        expect(isBlockingStatus(RESERVATION_STATUS.PENDING)).toBe(true);
        expect(isBlockingStatus(RESERVATION_STATUS.CONFIRMED)).toBe(true);
    });

    test('completed and cancelled reservations do not block the calendar', () => {
        expect(isBlockingStatus(RESERVATION_STATUS.COMPLETED)).toBe(false);
        expect(isBlockingStatus(RESERVATION_STATUS.CANCELLED)).toBe(false);
    });

    test("stays in sync with availability-domain.ts's BLOCKING_RESERVATION_STATUSES", () => {
        const blocking = Object.values(RESERVATION_STATUS).filter((status) =>
            isBlockingStatus(status),
        );

        expect(new Set(blocking)).toEqual(new Set(BLOCKING_RESERVATION_STATUSES));
    });
});
