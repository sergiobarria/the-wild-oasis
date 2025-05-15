<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CabinController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PageController;
use App\Mail\BookingConfirmedEmail;
use App\Models\Booking;
use App\Models\Cabin;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'index'])->name('pages.home');
Route::get('/about', [PageController::class, 'about'])->name('pages.about');
Route::get('/contact', [PageController::class, 'contact'])->name('pages.contact');

Route::get('/cabins', [CabinController::class, 'index'])->name('cabins.index');
Route::get('/cabins/{slug}', [CabinController::class, 'show'])->name('cabins.show');

Route::get('/checkout', [CheckoutController::class, 'summary'])->name('checkout.summary');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

Route::middleware('auth')->group(function () {
    Route::get('/account', [AccountController::class, 'index'])->name('account.index');
    Route::get('/account/reservations', [AccountController::class, 'reservations'])->name('account.reservations');
    Route::get('/account/profile', [AccountController::class, 'profile'])->name('account.profile');
});

Route::get('/register', fn() => view('auth.register'))->name('register');
Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.store');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Testing routes
Route::get('/mailable', function () {
    $user = \App\Models\User::factory()->make(['email' => 'john@example.com']);

    $user->setRelation('profile', new \App\Models\Profile(['name' => 'John Doe']));

    return new \App\Mail\WelcomeEmail($user);
});

Route::get('/mailable/booking-confirmed', function () {
    // New user
    $user = User::factory()->make(['email' => 'jane@example.com']);
    $user->setRelation('profile', new \App\Models\Profile(['name' => 'Jane Doe']));

    $cabin = Cabin::factory()->make(['name' => 'Sunset Cabin',]);

    $booking = new Booking([
        'start_date' => now()->addDays(7),
        'end_date' => now()->addDays(10),
        'guests' => 2,
        'nights' => 3,
        'subtotal' => 45000,
        'booking_fee' => 1500,
        'taxes' => 6000,
        'total' => 52500,
    ]);

    $booking->setRelation('user', $user);
    $booking->setRelation('cabin', $cabin);

    return new BookingConfirmedEmail($booking);
});
