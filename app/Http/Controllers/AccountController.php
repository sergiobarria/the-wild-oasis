<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('profile');

        $bookings = Booking::where('user_id', $user->id)->with('cabin')->get();

        $stats = [
            'total_bookings' => $bookings->count(),
            'total_nights' => $bookings->sum('nights'),
            'total_guests' => $bookings->sum('guests'),
            'total_spent' => $bookings->sum('total'),
            'member_since' => $user->created_at,
            'last_booking' => $bookings->sortByDesc('created_at')->first(),
            'next_booking' => $bookings->where('start_date', '>', now())->sortBy('start_date')->first(),
        ];

        return view('account.index', compact('user', 'stats'));
    }

    public function reservations()
    {
        $reservations = Booking::with('cabin')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();
        ray($reservations);

        return view('account.reservations', compact('reservations'));
    }

    public function profile()
    {
        return view('account.profile');
    }
}
