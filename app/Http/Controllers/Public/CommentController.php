<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Models\Setting;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    use LogsActivity;

    public function store(Request $request, Article $article)
    {
        // چک کن کامنت‌ها فعال هستن
        if (!Setting::get('allow_comments', true)) {
            return back()->with('error', 'ثبت کامنت در حال حاضر غیرفعال است.');
        }

        $validated = $request->validate([
            'content' => 'required|string|min:2|max:2000',
            'parent_id' => 'nullable|exists:comments,id',
            'name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
        ], [
            'content.required' => 'لطفاً متن کامنت را وارد کنید.',
            'content.min' => 'کامنت باید حداقل ۲ کاراکتر باشد.',
            'content.max' => 'کامنت نباید بیشتر از ۲۰۰۰ کاراکتر باشد.',
        ]);

        // اگه کاربر لاگین نیست، نام و ایمیل الزامیه
        if (!auth()->check()) {
            $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|max:255',
            ], [
                'name.required' => 'لطفاً نام خود را وارد کنید.',
                'email.required' => 'لطفاً ایمیل خود را وارد کنید.',
            ]);
        }

        $comment = Comment::create([
            'article_id' => $article->id,
            'user_id' => auth()->id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'name' => auth()->check() ? null : $validated['name'],
            'email' => auth()->check() ? null : $validated['email'],
            'content' => $validated['content'],
            'is_approved' => auth()->check(), // کاربران لاگین شده خودکار تأیید میشن
        ]);

        $this->logActivity('create', "کامنت جدید زیر مقاله «{$article->title}» ثبت شد", Comment::class, $comment->id);

        $message = auth()->check() 
            ? 'کامنت شما ثبت شد! 💙' 
            : 'کامنت شما ثبت شد و پس از تأیید مدیر نمایش داده می‌شود.';

        return back()->with('success', $message);
    }
}