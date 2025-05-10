<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CabinController extends Controller
{
    public function index()
    {
        return view('cabins.index');
    }
}
