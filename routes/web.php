<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CabinController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

Route::get('health', HealthCheckResultsController::class);

Route::get('', [PageController::class, 'index'])->name('home');
Route::get('about', [PageController::class, 'about'])->name('about');
Route::get('contact', [PageController::class, 'contact'])->name('contact');

Route::get('cabins', [CabinController::class, 'index'])->name('cabins.index');
Route::get('cabins/{slug}', [CabinController::class, 'show'])->name('cabins.show');

Route::get('checkout', [CheckoutController::class, 'summary'])->name('checkout.summary');
Route::get('checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

Route::prefix('admin')->group(function () {
    Route::get('', [AdminController::class, 'overview'])->name('admin.overview');
    Route::get('bookings', [AdminController::class, 'bookings'])->name('admin.bookings');
    Route::get('cabins', [AdminController::class, 'cabins'])->name('admin.cabins');
    Route::get('users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::get('messages', [AdminController::class, 'messages'])->name('admin.messages');
    Route::get('subscribers', [AdminController::class, 'subscribers'])->name('admin.subscribers');
});
