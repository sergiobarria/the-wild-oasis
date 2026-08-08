import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button', () => {
    it('renders its children', () => {
        render(<Button>Book cabin</Button>);

        expect(screen.getByRole('button', { name: 'Book cabin' })).toBeInTheDocument();
    });

    it('calls onClick when pressed', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<Button onClick={onClick}>Book cabin</Button>);
        await user.click(screen.getByRole('button', { name: 'Book cabin' }));

        expect(onClick).toHaveBeenCalledOnce();
    });

    it('does not fire onClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(
            <Button disabled onClick={onClick}>
                Book cabin
            </Button>,
        );
        await user.click(screen.getByRole('button', { name: 'Book cabin' }));

        expect(onClick).not.toHaveBeenCalled();
    });
});
