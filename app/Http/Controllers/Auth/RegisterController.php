<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        // Honeypot check
        if (! empty($request->input('website_url'))) {
            return redirect()->back();
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[\p{L}\p{N}\s]+$/u'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'اسمت رو بنویس تا بشناسیمت 😊',
            'name.regex' => 'فقط حروف و عدد مجازه؛ کاراکتر عجیب نذار.',
            'email.required' => 'ایمیلت رو جا انداختی!',
            'email.email' => 'قالب ایمیل یکم عجیب به نظر میاد.',
            'email.unique' => 'این ایمیل قبلاً ثبت‌نام کرده. اگه مال خودته، از صفحه‌ی ورود استفاده کن 💙',
            'password.required' => 'رمز عبور لازمه!',
            'password.min' => 'رمز باید حداقل ۸ کاراکتر باشه تا امن بمونه.',
            'password.confirmed' => 'تکرار رمز با اصلیش یکی نیست؛ دوباره چک کن.',
        ]);

        $user = User::create([
            'name' => Str::limit($validated['name'], 255),
            'email' => Str::lower($validated['email']),
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        event(new Registered($user)); // این ایمیل تایید رو ارسال می‌کنه!

        Auth::login($user);

        return redirect()->route('verification.notice');
    }
}