import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AvailabilitySearchCard } from './availability-search-card';

const push = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
}));

describe('AvailabilitySearchCard', () => {
    beforeEach(() => {
        push.mockClear();
    });

    it('redirects to /cabins with the search params on submit', async () => {
        const user = userEvent.setup();
        render(<AvailabilitySearchCard />);

        fireEvent.change(screen.getByLabelText('Check-in'), {
            target: { value: '2026-08-15' },
        });
        fireEvent.change(screen.getByLabelText('Check-out'), {
            target: { value: '2026-08-18' },
        });

        await user.click(screen.getByRole('button', { name: 'Check availability' }));

        expect(push).toHaveBeenCalledWith(
            '/cabins?checkIn=2026-08-15&checkOut=2026-08-18&guests=2',
        );
    });

    it('blocks submission when check-out is not after check-in', async () => {
        const user = userEvent.setup();
        render(<AvailabilitySearchCard />);

        fireEvent.change(screen.getByLabelText('Check-in'), {
            target: { value: '2026-08-15' },
        });
        fireEvent.change(screen.getByLabelText('Check-out'), {
            target: { value: '2026-08-10' },
        });
        fireEvent.blur(screen.getByLabelText('Check-out'));

        expect(await screen.findByText('Check-out must be after check-in.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Check availability' })).toBeDisabled();

        await user.click(screen.getByRole('button', { name: 'Check availability' }));
        expect(push).not.toHaveBeenCalled();
    });
});
