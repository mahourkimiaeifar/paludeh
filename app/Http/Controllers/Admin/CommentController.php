<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $status = $request->get('status', 'all');

        $query = Comment::with(['article', 'user'])->latest();

        if ($status === 'pending') {
            $query->where('is_approved', false);
        } elseif ($status === 'approved') {
            $query->where('is_approved', true);
        }

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $query->paginate(15)->through(fn ($c) => [
                'id' => $c->id,
                'author_name' => $c->author_name,
                'author_initial' => $c->author_initial,
                'email' => $c->email ?? $c->user?->email,
                'content' => mb_substr($c->content, 0, 150) . (mb_strlen($c->content) > 150 ? '...' : ''),
                'article_title' => $c->article->title,
                'is_approved' => $c->is_approved,
                'is_reply' => $c->parent_id !== null,
                'created_at' => $c->created_at->diffForHumans(),
            ]),
            'filters' => [
                'status' => $status,
            ],
            'stats' => [
                'total' => Comment::count(),
                'pending' => Comment::where('is_approved', false)->count(),
                'approved' => Comment::where('is_approved', true)->count(),
            ],
        ]);
    }

    public function approve(Comment $comment)
    {
        $comment->update(['is_approved' => !$comment->is_approved]);

        $action = $comment->is_approved ? 'تأیید' : 'رد';
        $this->logActivity('update', "کامنت {$action} شد", Comment::class, $comment->id);

        return back()->with('success', "کامنت {$action} شد!");
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        $this->logActivity('delete', 'کامنت حذف شد', Comment::class, $comment->id);
        return back()->with('success', 'کامنت حذف شد!');
    }
}