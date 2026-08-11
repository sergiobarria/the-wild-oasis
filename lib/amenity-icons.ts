import {
    AlarmSmoke,
    Baby,
    Bike,
    Book,
    BriefcaseBusiness,
    BriefcaseMedical,
    Cctv,
    ChefHat,
    CircleParking,
    Coffee,
    Dices,
    DoorOpen,
    Dumbbell,
    Flame,
    FlameKindling,
    Leaf,
    type LucideIcon,
    PawPrint,
    PlugZap,
    ShowerHead,
    Snowflake,
    Sparkles,
    Tv,
    WashingMachine,
    Waves,
    WavesLadder,
    Wifi,
} from 'lucide-react';

/**
 * Lucide export name (the DB's `amenities.icon` field, e.g. `"Wifi"`) -> icon component,
 * per spec §30/§72. Curated, not exhaustive: an icon only appears here once it reads at a
 * glance -- forcing a weak match for the rest would do more harm than leaving them out.
 * Kept in sync by eye with `convex/lib/amenities.ts`'s `AMENITY_ICON_NAMES` allow-list,
 * which validates every amenity's `icon` against exactly this set server-side.
 */
export const AMENITY_ICON_BY_KEY: Record<string, LucideIcon> = {
    Wifi,
    Snowflake,
    WashingMachine,
    BriefcaseBusiness,
    AlarmSmoke,
    BriefcaseMedical,
    Cctv,
    Baby,
    ChefHat,
    Coffee,
    WavesLadder,
    FlameKindling,
    ShowerHead,
    Waves,
    Leaf,
    Flame,
    Sparkles,
    Dumbbell,
    PawPrint,
    Tv,
    Dices,
    Book,
    CircleParking,
    Bike,
    PlugZap,
    DoorOpen,
};

/**
 * The 6 amenities worth surfacing as quick picks -- the home page's "Built for slowing down"
 * chips and the `/cabins` amenity filter both use this same curated set (spec §26 warns
 * against a full marketplace-style filter, so this stays a short, opinionated list rather
 * than exposing all ~26 amenities).
 */
export const CURATED_AMENITY_NAMES = [
    'WiFi',
    'Kitchen',
    'Fireplace',
    'Hot Tub',
    'Garden',
    'Grill / BBQ',
] as const;
