import { pixelBasedPreset } from 'react-email';

/**
 * Static hex mirror of the brand tokens in `app/globals.css` (oklch, CSS
 * variables) -- email clients can't reliably read either, so this config
 * hardcodes their sRGB equivalents instead. There is no build step that
 * derives one palette from the other; if the app palette changes, update
 * this by hand.
 *
 * Names match the app's token names on purpose: Prettier's Tailwind class
 * sorter (`tailwindStylesheet` in .prettierrc.json) already recognizes
 * `bg-background`, `text-foreground`, etc. from app/globals.css, so class
 * lists inside emails/ sort correctly with no extra config.
 */
export const emailTailwindConfig = {
    presets: [pixelBasedPreset],
    theme: {
        extend: {
            colors: {
                background: '#F5F5F5',
                card: '#FFFFFF',
                foreground: '#0A0A0A',
                'muted-foreground': '#737373',
                border: '#E5E5E5',
                primary: '#CDA451',
                'primary-foreground': '#0A0A0A',
            },
        },
    },
};
