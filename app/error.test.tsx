import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ErrorPage from './error';

describe('ErrorPage', () => {
    it('calls retry when "Try again" is clicked', async () => {
        const user = userEvent.setup();
        const retry = vi.fn();

        render(<ErrorPage error={new Error('boom')} retry={retry} />);
        await user.click(screen.getByRole('button', { name: 'Try again' }));

        expect(retry).toHaveBeenCalledOnce();
    });

    it('links back home', () => {
        render(<ErrorPage error={new Error('boom')} retry={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Back home' })).toHaveAttribute('href', '/');
    });

    it('shows the digest as a reference when present', () => {
        const error = Object.assign(new Error('boom'), { digest: 'abc123' });

        render(<ErrorPage error={error} retry={vi.fn()} />);

        expect(screen.getByText('Reference: abc123')).toBeInTheDocument();
    });

    it('omits the reference line when there is no digest', () => {
        render(<ErrorPage error={new Error('boom')} retry={vi.fn()} />);

        expect(screen.queryByText(/Reference:/)).not.toBeInTheDocument();
    });
});
