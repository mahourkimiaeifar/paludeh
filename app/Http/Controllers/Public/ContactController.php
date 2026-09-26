<?php

namespace App\Http\Controllers\Public;  // ← مهم: Public

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    use LogsActivity;

    public function create()
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ], [
            'name.required' => 'لطفاً نام خود را وارد کنید.',
            'name.max' => 'نام نباید بیشتر از ۲۵۵ کاراکتر باشد.',
            'email.required' => 'لطفاً ایمیل خود را وارد کنید.',
            'email.email' => 'لطفاً یک ایمیل معتبر وارد کنید.',
            'subject.required' => 'لطفاً موضوع پیام را وارد کنید.',
            'message.required' => 'لطفاً متن پیام را وارد کنید.',
            'message.min' => 'پیام باید حداقل ۱۰ کاراکتر باشد.',
            'message.max' => 'پیام نباید بیشتر از ۵۰۰۰ کاراکتر باشد.',
        ]);

        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        $this->logActivity('contact', "پیام جدید از {$contact->name} دریافت شد", Contact::class, $contact->id);

        return back()->with('success', 'پیام شما با موفقیت ارسال شد! به زودی با شما تماس می‌گیریم. 💙');
    }
}