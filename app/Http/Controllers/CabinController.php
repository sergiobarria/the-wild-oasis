<?php

namespace App\Http\Controllers;

use App\Models\Cabin;
use Illuminate\Http\Request;

class CabinController extends Controller
{
    public function index(Request $request)
    {
        $query = Cabin::query();
        if ($search = $request->query('q')) {
            $query->where('name', 'ilike', '%' . $search . '%');
        }

        $cabins = $query->select('id', 'name', 'slug', 'price_per_night', 'bedrooms', 'bathrooms', 'summary', 'max_guests')
            ->with('media')
            ->get();

        return view('cabins.index', compact('cabins'));
    }

    public function show(string $slug)
    {
        $cabin = Cabin::with([
            'media',
            'amenities',
            'reviews'
        ])->where('slug', $slug)->firstOrFail();
        ray($cabin);

        $recommendedCabins = Cabin::select('id', 'name', 'slug', 'price_per_night', 'bedrooms', 'bathrooms', 'summary', 'max_guests')
            ->where('id', '!=', $cabin->id)
            ->inRandomOrder()
            ->take(3)
            ->get();
        ray($recommendedCabins);

//        $cabin = (object)[
//            'name' => 'Cozy Mountain Cabin',
//            'slug' => 'cozy-mount-cabin',
//            'location' => 'Cortina d\'Ampezzo, Italy',
//            'description' => 'A secluded retreat in the heart of the Dolomites. Enjoy a private hot tub, fireplace, and panoramic views.',
//            'price_per_night' => 180,
//            'capacity' => 4,
//            'beds' => 2,
//            'main_image' => 'images/cabins/cabin-001.webp',
//            'gallery' => [
//                'images/cabins/cabin-001.webp',
//                'images/cabins/cabin-002.webp',
//                'images/cabins/cabin-003.webp',
//                'images/cabins/cabin-004.webp',
//            ],
//            'amenities' => [
//                'Private Hot Tub',
//                'Fireplace',
//                'Wi-Fi',
//                'Mountain View',
//                'Breakfast Included',
//            ],
//            'rating' => 4.7,
//            'reviews_count' => 38,
//            'reviews' => [
//                [
//                    'author' => 'Sofia L.',
//                    'rating' => 5,
//                    'comment' => 'Absolutely magical! The views were breathtaking and the hot tub was the perfect touch.',
//                    'date' => 'April 2024',
//                ],
//                [
//                    'author' => 'James K.',
//                    'rating' => 4,
//                    'comment' => 'Very cozy and clean. The fireplace made it extra special during our winter stay.',
//                    'date' => 'March 2024',
//                ],
//            ],
//        ];
//
//        $recommendedCabins = [
//            (object)[
//                'name' => 'Lakeview Lodge',
//                'slug' => 'lakeview-lodge',
//                'location' => 'Lake Garda',
//                'price_per_night' => 210,
//                'image' => 'images/cabins/cabin-002.webp',
//                'beds' => 2,
//                'capacity' => 4,
//            ],
//            (object)[
//                'name' => 'Forest Hideaway',
//                'slug' => 'forest-hideaway',
//                'location' => 'South Tyrol',
//                'price_per_night' => 190,
//                'image' => 'images/cabins/cabin-003.webp',
//                'beds' => 1,
//                'capacity' => 2,
//            ],
//        ];

        return view('cabins.show', compact('cabin', 'recommendedCabins'));
    }
}
