import { AvailabilitySearchCard } from './components/availability-search-card';
import { EscapeTheNoiseSection } from './components/escape-the-noise-section';
import { FeaturedCabinsSection } from './components/featured-cabins-section';
import { FinalCtaSection } from './components/final-cta-section';
import { HeroSection } from './components/hero-section';
import { SlowingDownSection } from './components/slowing-down-section';

export function HomeScreen() {
    return (
        <>
            <HeroSection />
            <div className='relative z-10 mx-auto -mt-20 max-w-4xl px-6 lg:px-8'>
                <AvailabilitySearchCard />
            </div>
            <EscapeTheNoiseSection />
            <SlowingDownSection />
            <FeaturedCabinsSection />
            <FinalCtaSection />
        </>
    );
}
