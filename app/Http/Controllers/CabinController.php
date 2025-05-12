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
            'reviews',
            'availability'
        ])->where('slug', $slug)->firstOrFail();

        $recommendedCabins = Cabin::select('id', 'name', 'slug', 'price_per_night', 'bedrooms', 'bathrooms', 'summary', 'max_guests')
            ->where('id', '!=', $cabin->id)
            ->inRandomOrder()
            ->take(3)
            ->get();

        return view('cabins.show', compact('cabin', 'recommendedCabins'));
    }
}
