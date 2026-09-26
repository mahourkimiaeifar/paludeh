<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    use LogsActivity;

    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        // تله‌ی ربات
        if (!empty($request->input('website_url'))) {
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

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            if (!$user->is_active) {
                Auth::logout();
                $this->logActivity('login_failed', "تلاش ناموفق ورود - حساب غیرفعال: {$credentials['email']}", null, null);
                return back()->withErrors([
                    'email' => 'حسابت موقتاً غیرفعاله. اگه فکر می‌کنی اشتباهی شده، با پشتیبانی در تماس باش 💙',
                ]);
            }

            $this->logActivity('login', "کاربر «{$user->name}» وارد شد", get_class($user), $user->id);

            if ($user->hasAnyRole(['super_admin', 'content_manager', 'support'])) {
                return redirect()->intended(route('admin.dashboard'));
            }

            return redirect()->intended('/');
        }

        $this->logActivity('login_failed', "تلاش ناموفق ورود: {$credentials['email']}", null, null);

        return back()->withErrors([
            'email' => 'این ایمیل و رمز با هم جور در نیومدن. یه بار دیگه با دقت امتحان کن؛ اگه رمزت یادت رفته، گزینه‌ی «فراموشی رمز» همین پایین هست 💙',
        ]);
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $this->logActivity('logout', "کاربر «{$user->name}» خارج شد", get_class($user), $user->id);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect(env('ADMIN_LOGIN_PATH', 'login'));
    }
}