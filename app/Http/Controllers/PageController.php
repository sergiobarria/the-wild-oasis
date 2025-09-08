<?php

namespace App\Http\Controllers;

class PageController extends Controller
{
    public function index()
    {
        return view('welcome');
    }

    public function about()
    {
        return view('pages.about');
    }

    public function contact()
    {
        return view('pages.contact');
    }
}
