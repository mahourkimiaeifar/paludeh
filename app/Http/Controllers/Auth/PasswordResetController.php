<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'ایمیلت رو بنویس تا لینک بازیابی رو بفرستیم 😊',
            'email.email' => 'قالب ایمیل یکم عجیب به نظر میاد.',
        ]);

        Password::sendResetLink($request->only('email'));

        // همیشه صفحه‌ی «ارسال شد» (رازدار: لو نمیدیم ایمیل وجود داره یا نه)
        return redirect()
            ->route('password.sent')
            ->with('sent_email', $this->maskEmail($request->email));
    }

    public function sent()
    {
        return Inertia::render('Auth/PasswordResetSent');
    }

    private function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email);
        $visible = mb_substr($local, 0, 2);

        return $visible . '***@' . $domain;
    }

    public function reset(Request $request, string $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email'),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'password.required' => 'رمز جدید رو وارد کن.',
            'password.min' => 'رمز باید حداقل ۸ کاراکتر باشه تا امن بمونه.',
            'password.confirmed' => 'تکرار رمز با اصلیش یکی نیست؛ دوباره چک کن.',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', 'رمزت با موفقیت عوض شد! حالا با رمز جدید وارد شو 🎉');
        }

        return back()->withErrors([
            'email' => 'این لینک بازیابی منقضی یا نامعتبره. یه لینک جدید درخواست بده 💙',
        ]);
    }
}