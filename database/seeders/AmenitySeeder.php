<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amenities = [
            ['name' => 'WiFi', 'icon' => 'wifi', 'group' => 'Interior'],
            ['name' => 'Kitchen', 'icon' => 'chef-hat', 'group' => 'Interior'],
            ['name' => 'Air Conditioner', 'icon' => 'thermometer-snowflake', 'group' => 'Interior'],
            ['name' => 'Fireplace', 'icon' => 'flame', 'group' => 'Interior'],
            ['name' => 'Washer', 'icon' => 'washer', 'group' => 'Interior'],
            ['name' => 'Dryer', 'icon' => 'wind', 'group' => 'Interior'],
            ['name' => 'Coffee Maker', 'icon' => 'coffee', 'group' => 'Interior'],
            ['name' => 'Workspace', 'icon' => 'laptop', 'group' => 'Interior'],
            ['name' => 'TV / Streaming', 'icon' => 'tv', 'group' => 'Interior'],
            ['name' => 'Books & Magazines', 'icon' => 'book-open', 'group' => 'Interior'],
            ['name' => 'Board Games', 'icon' => 'dice-5', 'group' => 'Interior'],

            ['name' => 'Swimming Pool', 'icon' => 'waves', 'group' => 'Exterior'],
            ['name' => 'Grill / BBQ', 'icon' => 'flame-kindling', 'group' => 'Exterior'],
            ['name' => 'Outdoor Shower', 'icon' => 'shower-head', 'group' => 'Exterior'],
            ['name' => 'Balcony', 'icon' => 'align-vertical-distribute-end', 'group' => 'Exterior'],
            ['name' => 'Hammock', 'icon' => 'tent-tree', 'group' => 'Exterior'],
            ['name' => 'Ocean View', 'icon' => 'mountain', 'group' => 'Exterior'],
            ['name' => 'Private Entrance', 'icon' => 'door-open', 'group' => 'Exterior'],
            ['name' => 'Garden', 'icon' => 'leaf', 'group' => 'Exterior'],

            ['name' => 'Crib', 'icon' => 'baby', 'group' => 'Family'],
            ['name' => 'High Chair', 'icon' => 'chair', 'group' => 'Family'],
            ['name' => 'Pet Friendly', 'icon' => 'paw-print', 'group' => 'Family'],

            ['name' => 'Hot Tub', 'icon' => 'hot-tub', 'group' => 'Wellness'],
            ['name' => 'Gym', 'icon' => 'dumbbell', 'group' => 'Wellness'],
            ['name' => 'Yoga Mats', 'icon' => 'activity', 'group' => 'Wellness'],
            ['name' => 'Spa Access', 'icon' => 'sparkles', 'group' => 'Wellness'],

            ['name' => 'Smoke Detector', 'icon' => 'alarm-smoke', 'group' => 'Security'],
            ['name' => 'Carbon Monoxide Detector', 'icon' => 'alarm-fire', 'group' => 'Security'],
            ['name' => 'First Aid Kit', 'icon' => 'first-aid-kit', 'group' => 'Security'],
            ['name' => 'Security Cameras', 'icon' => 'video', 'group' => 'Security'],

            ['name' => 'Parking', 'icon' => 'car', 'group' => 'Access'],
            ['name' => 'Bicycle Rental', 'icon' => 'bike', 'group' => 'Access'],
            ['name' => 'Electric Vehicle Charger', 'icon' => 'plug', 'group' => 'Access'],
        ];

        foreach ($amenities as $amenity) {
            Amenity::create($amenity);
        }
    }
}
