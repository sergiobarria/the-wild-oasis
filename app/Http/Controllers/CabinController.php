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
        $cabin = Cabin::where('slug', $slug)->firstOrFail();

        return view('cabins.show', ['cabin' => $cabin]);
    }
}
