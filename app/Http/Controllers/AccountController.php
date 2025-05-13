<?php

namespace App\Http\Controllers;

class AccountController extends Controller
{
    public function index()
    {
        $user = auth()->user()->load('profile');
        
        return view('account.index', compact('user'));
    }

    public function reservations()
    {
        return view('account.reservations');
    }

    public function profile()
    {
        return view('account.profile');
    }
}
