<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

/*
|--------------------------------------------------------------------------
| Public Controllers
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Public\ArticlePublicController;
use App\Http\Controllers\Public\PagePublicController;
use App\Http\Controllers\Public\ContactController as PublicContactController;
use App\Http\Controllers\Public\CommentController;

/*
|--------------------------------------------------------------------------
| Auth Controllers
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;

/*
|--------------------------------------------------------------------------
| Admin Controllers (همه با alias تا تداخل نداشته باشه)
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\CommentController as AdminCommentController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\CacheController;
use App\Http\Controllers\Admin\BackupController;

/*
|--------------------------------------------------------------------------
| Public Routes (مهمون‌ها)
|--------------------------------------------------------------------------
*/
Route::get('/', fn() => Inertia::render('Home'))->name('home');
Route::get('/about', fn() => Inertia::render('About'))->name('about');

// مقالات عمومی
Route::get('/articles', [ArticlePublicController::class, 'index'])->name('articles.index');
Route::get('/articles/{article:slug}', [ArticlePublicController::class, 'show'])->name('articles.show');
Route::post('/articles/{article}/comments', [CommentController::class, 'store'])->name('comments.store');

// صفحات عمومی
Route::get('/pages/{page:slug}', [PagePublicController::class, 'show'])->name('pages.show');

// فرم تماس (عمومی)
Route::get('/contact', [PublicContactController::class, 'create'])->name('contact');
Route::post('/contact', [PublicContactController::class, 'store'])->name('contact.store');

// صفحه حالت تعمیر
Route::get('/maintenance', fn() => Inertia::render('Maintenance'))->name('maintenance');

/*
|--------------------------------------------------------------------------
| Auth Routes (کاربران مهمون)
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
| Protected Routes (کاربران لاگین شده)
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
    
    // ═══ داشبورد ═══
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // ═══ مدیریت محتوا ═══
    Route::resource('articles', ArticleController::class)->except(['show']);
    Route::resource('pages', PageController::class)->except(['show']);
    
    // کامنت‌ها
    Route::get('/comments', [AdminCommentController::class, 'index'])->name('comments.index');
    Route::post('/comments/{comment}/approve', [AdminCommentController::class, 'approve'])->name('comments.approve');
    Route::delete('/comments/{comment}', [AdminCommentController::class, 'destroy'])->name('comments.destroy');

    // ═══ کاربران و دسترسی ═══
    Route::resource('users', UserController::class)->except(['show']);

    // ═══ ارتباطات ═══
    Route::get('/contacts', [AdminContactController::class, 'index'])->name('contacts.index');
    Route::get('/contacts/{contact}', [AdminContactController::class, 'show'])->name('contacts.show');
    Route::post('/contacts/{contact}/reply', [AdminContactController::class, 'reply'])->name('contacts.reply');
    Route::post('/contacts/{contact}/force-delete', [AdminContactController::class, 'forceDelete'])->name('contacts.force-delete');

    // ═══ سیستم و مانیتورینگ ═══
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::post('/activity-logs/clear', [ActivityLogController::class, 'clear'])->name('activity-logs.clear');
    Route::delete('/activity-logs/{activityLog}', [ActivityLogController::class, 'destroy'])->name('activity-logs.destroy');

    Route::get('/cache', [CacheController::class, 'index'])->name('cache.index');
    Route::post('/cache/clear/{type}', [CacheController::class, 'clear'])->name('cache.clear');

    Route::get('/backup', [BackupController::class, 'index'])->name('backup.index');
    Route::post('/backup/create', [BackupController::class, 'create'])->name('backup.create');
    Route::get('/backup/download/{filename}', [BackupController::class, 'download'])->name('backup.download');
    Route::delete('/backup/{filename}', [BackupController::class, 'destroy'])->name('backup.destroy');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // ═══ رسانه و دارایی ═══
    Route::get('/assets', fn() => Inertia::render('Admin/Placeholder', ['title' => 'دارایی‌های سه‌بعدی']))->name('assets');
});