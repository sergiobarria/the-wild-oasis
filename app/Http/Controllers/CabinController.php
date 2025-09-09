<?php

namespace App\Http\Controllers;

use App\Models\Cabin;

class CabinController extends Controller
{
    public function index()
    {
        return view('cabins.index');
    }

    public function show(string $slug)
    {
        $cabin = Cabin::with([
            'media',
            'amenities',
            'reviews' => fn($query) => $query->latest()->take(3),
            'bookings',
            'availabilities' => function ($query) {
                $query->select(['id', 'cabin_id', 'start_date', 'end_date'])
                    ->where('is_available', false);
            },
            // load other relations if needed...
        ])
            ->where('slug', $slug)
            ->firstOrFail();

        ds($cabin);

        $recommendedCabins = Cabin::where('id', '!=', $cabin->id)
            ->select(['id', 'name', 'slug', 'price_per_night', 'beds', 'baths', 'summary', 'max_guests'])
            ->inRandomOrder()
            ->take(3)
            ->get();

        return view('cabins.show', [
            'cabin' => $cabin,
            'recommendedCabins' => $recommendedCabins,
        ]);
    }
}
