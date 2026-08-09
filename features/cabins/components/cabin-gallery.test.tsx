import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { CabinGallery } from './cabin-gallery';

const IMAGES = [
    'https://example.com/1.jpg',
    'https://example.com/2.jpg',
    'https://example.com/3.jpg',
];

function lightbox() {
    // Base UI keeps the background content in the DOM (marked inert) rather than unmounting
    // it, so queries must be scoped to the dialog's own content to avoid matching the
    // gallery's thumbnails underneath.
    const content = document.querySelector('[data-slot="dialog-content"]');
    if (!content) throw new Error('Lightbox is not open.');
    return within(content as HTMLElement);
}

describe('CabinGallery', () => {
    it('opens the lightbox at the primary photo when clicked', async () => {
        const user = userEvent.setup();
        render(<CabinGallery images={IMAGES} cabinName='Pine Ridge Cabin' />);

        await user.click(screen.getByRole('button', { name: 'Pine Ridge Cabin photo 1 of 3' }));

        expect(lightbox().getByAltText('Pine Ridge Cabin photo 1 of 3')).toBeInTheDocument();
    });

    it('opens at a clicked secondary thumbnail, navigates with next, and resets on reopen', async () => {
        const user = userEvent.setup();
        render(<CabinGallery images={IMAGES} cabinName='Pine Ridge Cabin' />);

        await user.click(screen.getByRole('button', { name: 'Pine Ridge Cabin photo 2 of 3' }));
        expect(lightbox().getByAltText('Pine Ridge Cabin photo 2 of 3')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Next photo' }));
        expect(lightbox().getByAltText('Pine Ridge Cabin photo 3 of 3')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Close' }));
        await user.click(screen.getByRole('button', { name: 'Pine Ridge Cabin photo 1 of 3' }));

        expect(lightbox().getByAltText('Pine Ridge Cabin photo 1 of 3')).toBeInTheDocument();
    });

    it('navigates with the arrow keys', async () => {
        const user = userEvent.setup();
        render(<CabinGallery images={IMAGES} cabinName='Pine Ridge Cabin' />);

        await user.click(screen.getByRole('button', { name: 'Pine Ridge Cabin photo 1 of 3' }));
        expect(lightbox().getByAltText('Pine Ridge Cabin photo 1 of 3')).toBeInTheDocument();

        const content = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;

        fireEvent.keyDown(content, { key: 'ArrowRight' });
        expect(lightbox().getByAltText('Pine Ridge Cabin photo 2 of 3')).toBeInTheDocument();

        fireEvent.keyDown(content, { key: 'ArrowLeft' });
        expect(lightbox().getByAltText('Pine Ridge Cabin photo 1 of 3')).toBeInTheDocument();
    });

    it('does not render a thumbnail strip or nav buttons for a single-image gallery', () => {
        render(<CabinGallery images={[IMAGES[0]]} cabinName='Pine Ridge Cabin' />);

        expect(
            screen.queryByRole('button', { name: 'Pine Ridge Cabin photo 2 of 1' }),
        ).not.toBeInTheDocument();
    });
});
