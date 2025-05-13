<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CabinController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PageController;
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

Route::get('/account', [AccountController::class, 'index'])->name('account.index');
Route::get('/account/reservations', [AccountController::class, 'reservations'])->name('account.reservations');
Route::get('/account/profile', [AccountController::class, 'profile'])->name('account.profile');
