<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function create(Request $request)
    {
        return view('auth.login', [
            'redirect' => $request->query('redirect'),
        ]);
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $remember = $request->boolean('remember');
        $redirect = $request->input('redirect');
        ray($redirect);

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            if ($redirect && str_starts_with($redirect, config('app.url'))) {
                ray('INSIDE IF');
                return redirect()->to($redirect);
            }

            return redirect()->intended(route('account.index'));
        }

        return redirect()->back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function logout(Request $request)
    {
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('pages.home');
    }
}
