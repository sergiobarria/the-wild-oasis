import { BrandNav } from '@/features/brand/brand-nav';
import { ButtonsSection } from '@/features/brand/buttons-section';
import { CardsSection } from '@/features/brand/cards-section';
import { ColorTokensSection } from '@/features/brand/color-tokens-section';
import { FormControlsSection } from '@/features/brand/form-controls-section';
import { IconsSection } from '@/features/brand/icons-section';
import { MotionSection } from '@/features/brand/motion-section';
import { SpacingRadiusSection } from '@/features/brand/spacing-radius-section';
import { TypeScaleSection } from '@/features/brand/type-scale-section';
import { SITE_CONFIG } from '@/lib/site-config';

export function BrandScreen() {
    return (
        <div className='mx-auto w-full max-w-5xl px-6 py-12 lg:px-8'>
            {/* Faint survey-line texture -- a restrained nod to the brand's nature/
                craftsmanship words (spec §12), kept to a single low-opacity band
                rather than a page-wide decoration (spec §15 rules out excess). */}
            <header
                className='mb-16 border-b border-border pb-8'
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(180deg, transparent, transparent 23px, color-mix(in oklch, var(--border), transparent 50%) 24px)',
                }}
            >
                <p className='font-mono text-xs text-muted-foreground'>
                    /brand -- internal reference
                </p>
                <h1 className='mt-2 text-4xl font-light tracking-tight'>{SITE_CONFIG.NAME}</h1>
                <p className='mt-3 max-w-2xl text-sm text-muted-foreground'>
                    Design tokens, type, and components for {SITE_CONFIG.NAME}. Reference this
                    before shipping new UI -- if a screen needs a color, weight, or spacing value
                    that isn&apos;t here, it&apos;s either a new decision worth documenting or a
                    sign the screen is reaching for something the brand doesn&apos;t use.
                </p>
            </header>

            <div className='flex gap-12'>
                <BrandNav />
                <main className='min-w-0 flex-1 space-y-16'>
                    <ColorTokensSection />
                    <TypeScaleSection />
                    <SpacingRadiusSection />
                    <ButtonsSection />
                    <FormControlsSection />
                    <CardsSection />
                    <IconsSection />
                    <MotionSection />

                    <section
                        id='accessibility-note'
                        className='scroll-mt-8 space-y-3 border-t border-border pt-8'
                    >
                        <h2 className='text-lg font-medium'>A note on contrast</h2>
                        <p className='max-w-2xl text-sm text-muted-foreground'>
                            Every ratio on this page was computed (OKLab → linear sRGB → WCAG
                            relative luminance), not eyeballed. Two decisions came directly out of
                            that math:
                        </p>
                        <ul className='max-w-2xl list-inside list-disc space-y-1 text-sm text-muted-foreground'>
                            <li>
                                Near-black text pairs with the gold primary, not white -- white on
                                the spec&apos;s exact gold value measures 2.23:1, near-black
                                measures 8.50:1.
                            </li>
                            <li>
                                Primary and destructive are used as soft-tint text/backgrounds (
                                <code className='font-mono text-xs'>bg-*/10</code>,{' '}
                                <code className='font-mono text-xs'>text-*</code>), never a solid
                                fill with light text on top, in dark mode -- the stock destructive
                                red only clears 4.5:1 as text-on-background (6.86:1), not as a
                                white-text solid fill (2.76:1).
                            </li>
                        </ul>
                        <p className='max-w-2xl text-sm text-muted-foreground'>
                            The one exception is the border token itself: spec §13 calls for it to
                            &quot;remain subtle,&quot; and at 1.33:1 against the background
                            it&apos;s decorative by design, not a boundary anyone needs to perceive
                            to operate a control. Inputs get a visible overlay and every focusable
                            element gets the 8.5:1 gold ring instead.
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}
