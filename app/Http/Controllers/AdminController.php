<?php

namespace App\Http\Controllers;

class AdminController extends Controller
{
    public function overview()
    {
        return view('admin.overview');
    }

    public function bookings()
    {
        return view('admin.bookings');
    }

    public function cabins()
    {
        return view('admin.cabins');
    }

    public function users()
    {
        return view('admin.users');
    }

    public function settings()
    {
        return view('admin.settings');
    }

    public function messages()
    {
        return view('admin.contact');
    }

    public function subscribers()
    {
        return view('admin.subscribers');
    }
}
