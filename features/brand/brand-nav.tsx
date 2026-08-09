const SECTIONS = [
    { id: 'color', label: 'Color' },
    { id: 'type', label: 'Type' },
    { id: 'spacing', label: 'Spacing & radius' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'forms', label: 'Form controls' },
    { id: 'cards', label: 'Cards & elevation' },
    { id: 'icons', label: 'Icons' },
    { id: 'motion', label: 'Motion' },
] as const;

export function BrandNav() {
    return (
        <nav
            aria-label='Brand reference sections'
            className='top-8 hidden h-fit shrink-0 basis-44 flex-col gap-1 self-start lg:sticky lg:flex'
        >
            {SECTIONS.map((section, index) => (
                <a
                    key={section.id}
                    href={`#${section.id}`}
                    className='rounded-md px-2 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'
                >
                    <span className='text-primary'>§{String(index + 1).padStart(2, '0')}</span>{' '}
                    {section.label}
                </a>
            ))}
        </nav>
    );
}
