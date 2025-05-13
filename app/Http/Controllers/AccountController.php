<?php

namespace App\Http\Controllers;

class AccountController extends Controller
{
    public function index()
    {
        return view('account.index');
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
