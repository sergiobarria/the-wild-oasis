import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AboutScreen } from './about-screen';

describe('AboutScreen', () => {
    it('renders the CTA linking to /cabins', () => {
        render(<AboutScreen galleryImageUrls={[]} />);

        expect(screen.getByRole('button', { name: 'Explore cabins' })).toHaveAttribute(
            'href',
            '/cabins',
        );
    });

    it('omits the gallery section when there are no images', () => {
        render(<AboutScreen galleryImageUrls={[]} />);

        expect(screen.queryByText('A few of our cabins')).not.toBeInTheDocument();
    });

    it('renders a gallery image for each provided url', () => {
        const { container } = render(
            <AboutScreen
                galleryImageUrls={['https://example.com/a.jpg', 'https://example.com/b.jpg']}
            />,
        );

        expect(screen.getByText('A few of our cabins')).toBeInTheDocument();
        // Decorative images (alt="") are excluded from the accessibility tree's "img" role,
        // so a plain DOM query stands in for `getAllByRole` here.
        expect(container.querySelectorAll('img')).toHaveLength(2);
    });
});
