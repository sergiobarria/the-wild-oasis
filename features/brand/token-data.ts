export type ColorToken = {
    name: string;
    cssVar: string;
    oklch: string;
    hex: string;
    usage: string;
};

export type ColorTokenGroup = {
    label: string;
    tokens: ColorToken[];
};

/**
 * Hex values are derived (OKLab -> linear sRGB -> sRGB) from the exact OKLCH
 * triples in app/globals.css -- shown for anyone who reads hex faster than
 * OKLCH, not a second source of truth. If a token in globals.css changes,
 * update its row here too.
 */
export const DARK_TOKEN_GROUPS: ColorTokenGroup[] = [
    {
        label: 'Surface',
        tokens: [
            {
                name: 'Background',
                cssVar: '--background',
                oklch: 'oklch(0.145 0 0)',
                hex: '#0a0a0a',
                usage: 'Page background. Near-black -- spec §13.',
            },
            {
                name: 'Card',
                cssVar: '--card',
                oklch: 'oklch(0.205 0 0)',
                hex: '#171717',
                usage: 'Cards and panels sit subtly above the page.',
            },
            {
                name: 'Secondary',
                cssVar: '--secondary',
                oklch: 'oklch(0.269 0 0)',
                hex: '#262626',
                usage: 'Secondary buttons, subtly-raised surfaces.',
            },
        ],
    },
    {
        label: 'Text',
        tokens: [
            {
                name: 'Foreground',
                cssVar: '--foreground',
                oklch: 'oklch(0.985 0 0)',
                hex: '#fafafa',
                usage: 'Primary text. 18.96:1 on background.',
            },
            {
                name: 'Muted foreground',
                cssVar: '--muted-foreground',
                oklch: 'oklch(0.708 0 0)',
                hex: '#a1a1a1',
                usage: 'De-emphasized text. 7.63:1 on background.',
            },
        ],
    },
    {
        label: 'Brand',
        tokens: [
            {
                name: 'Primary',
                cssVar: '--primary',
                oklch: 'oklch(0.7394 0.112 83.18)',
                hex: '#cda451',
                usage: 'Gold accent -- spec §13 exact value. Primary buttons, links, active states. Never a large surface.',
            },
        ],
    },
    {
        label: 'Status',
        tokens: [
            {
                name: 'Destructive',
                cssVar: '--destructive',
                oklch: 'oklch(0.704 0.191 22.216)',
                hex: '#ff6467',
                usage: 'Soft-tint text only (bg-destructive/10) -- see rationale below.',
            },
        ],
    },
    {
        label: 'Structure',
        tokens: [
            {
                name: 'Border',
                cssVar: '--border',
                oklch: 'oklch(0.275 0 0)',
                hex: '#282828',
                usage: 'Deliberately subtle (spec §13). 1.33:1 -- decorative, not load-bearing.',
            },
            {
                name: 'Ring',
                cssVar: '--ring',
                oklch: 'oklch(0.7394 0.112 83.18)',
                hex: '#cda451',
                usage: 'Focus ring. Same value as primary -- gold marks every interactive state.',
            },
        ],
    },
];

export const LIGHT_TOKEN_GROUPS: ColorTokenGroup[] = [
    {
        label: 'Surface',
        tokens: [
            {
                name: 'Background',
                cssVar: '--background',
                oklch: 'oklch(1 0 0)',
                hex: '#ffffff',
                usage: 'Page background.',
            },
            {
                name: 'Card',
                cssVar: '--card',
                oklch: 'oklch(1 0 0)',
                hex: '#ffffff',
                usage: 'Distinguished from background by border, not tone.',
            },
            {
                name: 'Secondary',
                cssVar: '--secondary',
                oklch: 'oklch(0.97 0 0)',
                hex: '#f5f5f5',
                usage: 'Secondary buttons, subtly-raised surfaces.',
            },
        ],
    },
    {
        label: 'Text',
        tokens: [
            {
                name: 'Foreground',
                cssVar: '--foreground',
                oklch: 'oklch(0.145 0 0)',
                hex: '#0a0a0a',
                usage: 'Primary text -- same value as dark mode’s background, inverted role.',
            },
            {
                name: 'Muted foreground',
                cssVar: '--muted-foreground',
                oklch: 'oklch(0.556 0 0)',
                hex: '#737373',
                usage: 'De-emphasized text. 4.73:1 on background.',
            },
        ],
    },
    {
        label: 'Brand',
        tokens: [
            {
                name: 'Primary',
                cssVar: '--primary',
                oklch: 'oklch(0.58 0.112 83.18)',
                hex: '#9a7317',
                usage: 'Same hue/chroma as dark primary, deepened for a white surface.',
            },
        ],
    },
    {
        label: 'Status',
        tokens: [
            {
                name: 'Destructive',
                cssVar: '--destructive',
                oklch: 'oklch(0.577 0.245 27.325)',
                hex: '#e7000b',
                usage: 'Works as solid white-text fill here (4.64:1) -- unlike dark mode.',
            },
        ],
    },
    {
        label: 'Structure',
        tokens: [
            {
                name: 'Border',
                cssVar: '--border',
                oklch: 'oklch(0.922 0 0)',
                hex: '#e5e5e5',
                usage: 'Deliberately subtle, same reasoning as dark mode.',
            },
            {
                name: 'Ring',
                cssVar: '--ring',
                oklch: 'oklch(0.58 0.112 83.18)',
                hex: '#9a7317',
                usage: 'Focus ring, matches primary.',
            },
        ],
    },
];

export const RADIUS_SCALE = [
    { name: 'sm', className: 'rounded-sm', formula: 'radius * 0.6' },
    { name: 'md', className: 'rounded-md', formula: 'radius * 0.8' },
    { name: 'lg', className: 'rounded-lg', formula: 'radius (base, 0.625rem)' },
    { name: 'xl', className: 'rounded-xl', formula: 'radius * 1.4' },
    { name: '2xl', className: 'rounded-2xl', formula: 'radius * 1.8' },
    { name: '3xl', className: 'rounded-3xl', formula: 'radius * 2.2' },
] as const;
