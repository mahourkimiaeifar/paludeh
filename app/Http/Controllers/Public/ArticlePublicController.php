<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Morilog\Jalali\Jalalian;

class ArticlePublicController extends Controller
{
    public function index()
    {
        return Inertia::render('Articles/Index', [
            'articles' => Article::where('status', 'published')
                ->with('author')
                ->latest('published_at')
                ->get()
                ->map(fn($a) => [
                    'id' => $a->id,
                    'title' => $a->title,
                    'slug' => $a->slug,
                    'excerpt' => $a->excerpt,
                    'featured_image' => $a->featured_image ? asset('storage/' . $a->featured_image) : null,
                    'author' => $a->author->name,
                    'published_at' => $a->published_at
                        ? Jalalian::fromCarbon($a->published_at)->format('Y/m/d')
                        : null,
                ]),
        ]);
    }

    public function show(Article $article)
    {
        // اگه مقاله منتشر نشده، ۴۰۴ بده
        if ($article->status !== 'published') {
            abort(404);
        }

        // کامنت‌های تأیید شده
        $comments = $article->comments()
            ->where('is_approved', true)
            ->whereNull('parent_id')
            ->with([
                'replies' => fn($q) => $q->where('is_approved', true)->with('user'),
                'user',
            ])
            ->latest()
            ->get();

        return Inertia::render('Articles/Show', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'featured_image' => $article->featured_image ? asset('storage/' . $article->featured_image) : null,
                'author' => $article->author?->name ?? 'ناشناس',
                'published_at' => $article->published_at
                    ? \Morilog\Jalali\Jalalian::fromCarbon($article->published_at)->format('Y/m/d')
                    : null,
                'meta_title' => $article->meta_title,
                'meta_description' => $article->meta_description,
            ],
            'comments' => $comments->map(fn($c) => [
                'id' => $c->id,
                'author_name' => $c->author_name,
                'author_initial' => $c->author_initial,
                'content' => $c->content,
                'is_admin' => $c->user?->hasAnyRole(['super_admin', 'content_manager']) ?? false,
                'created_at' => $c->created_at->diffForHumans(),
                'replies' => $c->replies->map(fn($r) => [
                    'id' => $r->id,
                    'author_name' => $r->author_name,
                    'author_initial' => $r->author_initial,
                    'content' => $r->content,
                    'is_admin' => $r->user?->hasAnyRole(['super_admin', 'content_manager']) ?? false,
                    'created_at' => $r->created_at->diffForHumans(),
                ]),
            ]),
            'allowComments' => \App\Models\Setting::get('allow_comments', true),
        ]);
    }
}