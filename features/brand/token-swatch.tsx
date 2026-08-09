import type { ColorToken } from '@/features/brand/token-data';

export function TokenSwatch({ token }: { token: ColorToken }) {
    return (
        <div className='flex items-start gap-3 rounded-lg border border-border p-3'>
            <div
                className='mt-0.5 size-10 shrink-0 rounded-md border border-border'
                style={{ backgroundColor: `var(${token.cssVar})` }}
                aria-hidden
            />
            <div className='min-w-0 space-y-1'>
                <p className='text-sm font-medium'>{token.name}</p>
                <p className='truncate font-mono text-xs text-muted-foreground'>
                    {token.cssVar} · {token.hex}
                </p>
                <p className='font-mono text-xs text-muted-foreground'>{token.oklch}</p>
                <p className='text-xs text-muted-foreground'>{token.usage}</p>
            </div>
        </div>
    );
}
