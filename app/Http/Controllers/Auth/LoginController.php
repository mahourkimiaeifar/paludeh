<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        // Honeypot check
        if (! empty($request->input('website_url'))) {
            // رباته! بدون ارور، فقط برگردون به صفحه
            return redirect()->back();
        }

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'ایمیلت رو جا انداختی؛ فیلد اول منتظرته 😊',
            'email.email' => 'قالب ایمیل یکم عجیب به نظر میاد؛ چیزی مثل you@example.com بنویس.',
            'password.required' => 'رمز عبور رو هم وارد کن تا در رو باز کنیم 🔑',
        ]);

        // Rate limit check
        if (RateLimiter::tooManyAttempts('login:'.$request->ip(), 5)) {
            return back()->withErrors([
                'email' => 'تعداد تلاش‌هات زیاد شده! یه دقیقه صبر کن و دوباره امتحان کن 💙',
            ]);
        }

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::clear('login:'.$request->ip());
            $request->session()->regenerate();

            $user = Auth::user();

            if (! $user->is_active) {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'حسابت موقتاً غیرفعاله. اگه فکر می‌کنی اشتباهی شده، با پشتیبانی در تماس باش 💙',
                ]);
            }

            if ($user->hasAnyRole(['super_admin', 'content_manager', 'support'])) {
                return redirect()->intended(route('admin.dashboard'));
            }

            return redirect()->intended('/');
        }

        RateLimiter::hit('login:'.$request->ip());

        return back()->withErrors([
            'email' => 'این ایمیل و رمز با هم جور در نیومدن. یه بار دیگه با دقت امتحان کن؛ اگه رمزت یادت رفته، گزینه‌ی «فراموشی رمز» همین پایین هست 💙',
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}