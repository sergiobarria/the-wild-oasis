import { DARK_TOKEN_GROUPS, LIGHT_TOKEN_GROUPS } from '@/features/brand/token-data';
import { TokenSwatch } from '@/features/brand/token-swatch';

function TokenPalette({ groups }: { groups: typeof DARK_TOKEN_GROUPS }) {
    return (
        <div className='space-y-6'>
            {groups.map((group) => (
                <div key={group.label} className='space-y-2'>
                    <p className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
                        {group.label}
                    </p>
                    <div className='grid gap-2 sm:grid-cols-2'>
                        {group.tokens.map((token) => (
                            <TokenSwatch key={token.cssVar + token.name} token={token} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ColorTokensSection() {
    return (
        <section id='color' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Color</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    Dark is the primary brand experience (spec §13) and is what the app renders by
                    default. Light stays fully defined for when a toggle exists, shown here for
                    reference. Every ratio below was computed, not eyeballed --{' '}
                    <a
                        href='#accessibility-note'
                        className='text-primary underline-offset-4 hover:underline'
                    >
                        see the note on contrast and the soft-tint convention
                    </a>
                    .
                </p>
            </div>
            <div className='grid gap-8 lg:grid-cols-2'>
                <div className='dark rounded-xl border border-border bg-background p-5 text-foreground'>
                    <p className='mb-4 font-mono text-xs text-muted-foreground'>.dark (default)</p>
                    <TokenPalette groups={DARK_TOKEN_GROUPS} />
                </div>
                <div className='light rounded-xl border border-border bg-background p-5 text-foreground'>
                    <p className='mb-4 font-mono text-xs text-muted-foreground'>:root (light)</p>
                    <TokenPalette groups={LIGHT_TOKEN_GROUPS} />
                </div>
            </div>
        </section>
    );
}
