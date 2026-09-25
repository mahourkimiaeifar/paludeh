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
                ->map(fn ($a) => [
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
        if ($article->status !== 'published') {
            abort(404);
        }

        return Inertia::render('Articles/Show', [
            'article' => [
                'title' => $article->title,
                'slug' => $article->slug,
                'content' => $article->content,
                'excerpt' => $article->excerpt,
                'featured_image' => $article->featured_image ? asset('storage/' . $article->featured_image) : null,
                'author' => $article->author->name,
                'published_at' => $article->published_at 
                    ? Jalalian::fromCarbon($article->published_at)->format('Y/m/d')
                    : null,
                'meta_title' => $article->meta_title ?: $article->title,
                'meta_description' => $article->meta_description ?: $article->excerpt,
            ],
        ]);
    }
}