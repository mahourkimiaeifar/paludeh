<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Public\ArticlePublicController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Public Routes (مهمون‌ها)
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => redirect('/articles'));
Route::get('/articles', [ArticlePublicController::class, 'index'])->name('articles.index');
Route::get('/articles/{article:slug}', [ArticlePublicController::class, 'show'])->name('articles.show');

/*
|--------------------------------------------------------------------------
| Auth Routes (احراز هویت)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get(env('ADMIN_LOGIN_PATH', 'login'), [LoginController::class, 'create'])->name('login');
    Route::post(env('ADMIN_LOGIN_PATH', 'login'), [LoginController::class, 'store']);

    Route::get('/forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'store'])->name('password.email');
    Route::get('/forgot-password/sent', [PasswordResetController::class, 'sent'])->name('password.sent');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'reset'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'update'])->name('password.update');
});

Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

/*
|--------------------------------------------------------------------------
| Verification Routes (تایید ایمیل)
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/email/verify', fn() => Inertia::render('Auth/VerifyEmail'))->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();
        return redirect('/admin');
    })->middleware('signed')->name('verification.verify');
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return back()->with('message', 'لینک تایید دوباره ارسال شد! 💙');
    })->name('verification.send');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (پنل مدیریت)
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    // داشبورد
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // کاربران
    Route::resource('users', UserController::class)->except(['show']);

    // مقالات
    Route::resource('articles', ArticleController::class)->except(['show']);

    // صفحات دیگه (موقتاً placeholder)
    Route::get('/pages', fn() => Inertia::render('Admin/Placeholder', ['title' => 'مدیریت صفحات']))->name('pages');
    Route::get('/assets', fn() => Inertia::render('Admin/Placeholder', ['title' => 'دارایی‌های سه‌بعدی']))->name('assets');
    Route::get('/settings', fn() => Inertia::render('Admin/Placeholder', ['title' => 'تنظیمات سراسری']))->name('settings');
});