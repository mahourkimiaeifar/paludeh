<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $action = $request->get('action');
        $search = $request->get('search');

        $query = ActivityLog::with('user')->latest();

        if ($action && $action !== 'all') {
            $query->where('action', $action);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"));
            });
        }

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $query->paginate(20)->through(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'action_label' => $log->action_label,
                'action_icon' => $log->action_icon,
                'description' => $log->description,
                'user_name' => $log->user?->name ?? 'سیستم',
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at->diffForHumans(),
            ]),
            'filters' => [
                'action' => $action ?? 'all',
                'search' => $search ?? '',
            ],
        ]);
    }

    public function destroy(ActivityLog $activityLog)
    {
        $activityLog->delete();
        return back()->with('success', 'لاگ حذف شد');
    }

    public function clear()
    {
        ActivityLog::where('created_at', '<', now()->subDays(30))->delete();
        return back()->with('success', 'لاگ‌های قدیمی پاک شدند');
    }
}