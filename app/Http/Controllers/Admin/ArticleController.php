<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Morilog\Jalali\Jalalian;

class ArticleController extends Controller
{
    use LogsActivity;

    public function index()
    {
        return Inertia::render('Admin/Articles/Index', [
            'articles' => Article::with('author')
                ->latest()
                ->get()
                ->map(fn($a) => [
                    'id' => $a->id,
                    'title' => $a->title,
                    'slug' => $a->slug,
                    'status' => $a->status,
                    'featured_image' => $a->featured_image ? asset('storage/' . $a->featured_image) : null,
                    'author' => $a->author->name,
                    'published_at' => $a->published_at
                        ? Jalalian::fromCarbon($a->published_at)->format('Y/m/d')
                        : null,
                    'created_at' => Jalalian::fromCarbon($a->created_at)->format('Y/m/d'),
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Articles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:articles,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'published_at' => 'nullable|date',
        ]);

        $imagePath = null;
        if ($request->hasFile('featured_image')) {
            $imagePath = $request->file('featured_image')->store('articles', 'public');
        }

        $article = Article::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'featured_image' => $imagePath,
            'status' => $validated['status'],
            'meta_title' => $validated['meta_title'],
            'meta_description' => $validated['meta_description'],
            'published_at' => $validated['status'] === 'published' ? now() : $validated['published_at'],
        ]);

        $this->logActivity('create', "مقاله «{$article->title}» ساخته شد", Article::class, $article->id);

        return redirect()->route('admin.articles.index')->with('success', 'مقاله با موفقیت ساخته شد!');
    }

    public function edit(Article $article)
    {
        return Inertia::render('Admin/Articles/Edit', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'featured_image' => $article->featured_image ? asset('storage/' . $article->featured_image) : null,
                'status' => $article->status,
                'meta_title' => $article->meta_title,
                'meta_description' => $article->meta_description,
                'published_at' => $article->published_at ? $article->published_at->format('Y-m-d\TH:i') : null,
            ],
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $oldValues = $article->only(['title', 'status']);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:articles,slug,' . $article->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'published_at' => 'nullable|date',
        ]);

        $imagePath = $article->featured_image;
        if ($request->hasFile('featured_image')) {
            if ($article->featured_image) {
                Storage::disk('public')->delete($article->featured_image);
            }
            $imagePath = $request->file('featured_image')->store('articles', 'public');
        }

        $article->update([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'featured_image' => $imagePath,
            'status' => $validated['status'],
            'meta_title' => $validated['meta_title'],
            'meta_description' => $validated['meta_description'],
            'published_at' => $validated['status'] === 'published' && !$article->published_at ? now() : $validated['published_at'],
        ]);

        $this->logActivity('update', "مقاله «{$article->title}» ویرایش شد", Article::class, $article->id, $oldValues, $article->only(['title', 'status']));

        return redirect()->route('admin.articles.index')->with('success', 'مقاله ویرایش شد!');
    }

    public function destroy(Article $article)
    {
        if ($article->featured_image) {
            Storage::disk('public')->delete($article->featured_image);
        }
        $title = $article->title;
        $article->delete();

        $this->logActivity('delete', "مقاله «{$title}» حذف شد", Article::class, $article->id);

        return redirect()->route('admin.articles.index')->with('success', 'مقاله حذف شد!');
    }
}