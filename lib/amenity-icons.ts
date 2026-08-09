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
 * Amenity name -> Lucide icon, per spec §30/§72. Curated, not exhaustive: an
 * amenity only appears here once it has an icon that actually reads at a
 * glance -- forcing a weak match for the rest (Dryer, Hammock, Balcony, High
 * Chair, Carbon Monoxide Detector) would do more harm than leaving them out.
 */
export const AMENITY_ICON_MAP: Record<string, LucideIcon> = {
    WiFi: Wifi,
    Kitchen: ChefHat,
    'Air Conditioner': Snowflake,
    Fireplace: Flame,
    'Coffee Maker': Coffee,
    'TV / Streaming': Tv,
    'Board Games': Dices,
    Washer: WashingMachine,
    Workspace: BriefcaseBusiness,
    'Books & Magazines': Book,
    'Swimming Pool': WavesLadder,
    'Grill / BBQ': FlameKindling,
    'Outdoor Shower': ShowerHead,
    'Ocean View': Waves,
    'Private Entrance': DoorOpen,
    Garden: Leaf,
    Crib: Baby,
    'Pet Friendly': PawPrint,
    'Hot Tub': Sparkles,
    Gym: Dumbbell,
    'Smoke Detector': AlarmSmoke,
    'Security Cameras': Cctv,
    'First Aid Kit': BriefcaseMedical,
    Parking: CircleParking,
    'Bicycle Rental': Bike,
    'Electric Vehicle Charger': PlugZap,
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
