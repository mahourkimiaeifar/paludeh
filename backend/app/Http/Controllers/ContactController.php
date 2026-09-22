<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // TODO: ذخیره پیام در دیتابیس یا ارسال ایمیل
        // فعلاً فقط موفقیت را برمی‌گردانیم

        return back()->with('success', 'پیام شما با موفقیت ارسال شد.');
    }
}
