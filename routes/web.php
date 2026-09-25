<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Admin\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store']);
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/admin', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/users', fn () => Inertia::render('Admin/Placeholder', ['title' => 'مدیریت کاربران']))->name('admin.users');
    Route::get('/admin/articles', fn () => Inertia::render('Admin/Placeholder', ['title' => 'مدیریت مقالات']))->name('admin.articles');
    Route::get('/admin/pages', fn () => Inertia::render('Admin/Placeholder', ['title' => 'مدیریت صفحات']))->name('admin.pages');
    Route::get('/admin/assets', fn () => Inertia::render('Admin/Placeholder', ['title' => 'دارایی‌های سه‌بعدی']))->name('admin.assets');
    Route::get('/admin/settings', fn () => Inertia::render('Admin/Placeholder', ['title' => 'تنظیمات سراسری']))->name('admin.settings');
});

// Verification routes
Route::get('/email/verify', function () {
    return Inertia::render('Auth/VerifyEmail');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('/admin');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'لینک تایید دوباره ارسال شد! 💙');
})->middleware('auth')->name('verification.send');

Route::get('/forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
Route::post('/forgot-password', [PasswordResetController::class, 'store'])->name('password.email');
Route::get('/reset-password/{token}', [PasswordResetController::class, 'reset'])->name('password.reset');
Route::post('/reset-password', [PasswordResetController::class, 'update'])->name('password.update');
Route::get('/forgot-password/sent', [PasswordResetController::class, 'sent'])->name('password.sent');