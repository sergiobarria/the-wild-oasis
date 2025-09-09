<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AuthPageController extends Controller
{
    public function register(): View
    {
        return (view('auth.register'));
    }

    public function login(): View
    {
        return (view('auth.login'));
    }

    public function logout(Request $request)
    {
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('logout', 'You have been logged out.');
    }
}
