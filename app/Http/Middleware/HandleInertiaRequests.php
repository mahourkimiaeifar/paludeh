<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Log;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames()->toArray(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
            ],
            'admin_stats' => $user && $user->hasAnyRole(['super_admin', 'content_manager', 'support']) ? [
                'new_comments' => \App\Models\Comment::where('is_approved', false)->count(),
                'new_messages' => \App\Models\Contact::where('status', 'new')->count(),
                'today_logs' => \App\Models\ActivityLog::whereDate('created_at', today())->count(),
                'cache_size' => $this->getCacheSize(),
            ] : null,
        ]);
    }

    private function getCacheSize(): string
    {
        $cachePath = storage_path('framework/cache/data');
        if (!is_dir($cachePath)) return '0 B';

        $size = 0;
        try {
            foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($cachePath)) as $file) {
                if ($file->isFile()) {
                    $size += $file->getSize();
                }
            }
        } catch (\Exception $e) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $pow = floor(($size ? log($size) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $size /= pow(1024, $pow);

        return round($size, 1) . ' ' . $units[$pow];
    }
}