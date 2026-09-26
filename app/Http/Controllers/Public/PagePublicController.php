<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Inertia\Inertia;

class PagePublicController extends Controller
{
    public function show(Page $page)
    {
        if (!$page->is_published) {
            abort(404);
        }

        return Inertia::render('Pages/Show', [
            'page' => [
                'title' => $page->title,
                'slug' => $page->slug,
                'content' => $page->content,
                'meta_title' => $page->meta_title ?: $page->title,
                'meta_description' => $page->meta_description ?: '',
            ],
        ]);
    }
}