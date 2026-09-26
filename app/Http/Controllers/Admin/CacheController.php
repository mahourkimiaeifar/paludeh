<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Concerns\LogsActivity;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class CacheController extends Controller
{
    use LogsActivity;

    public function index()
    {
        return Inertia::render('Admin/Cache/Index', [
            'cache_info' => [
                'app_cache' => Cache::get('settings.all') ? 'فعال' : 'غیرفعال',
                'config_cache' => file_exists(config_path('cache.php')) ? 'فعال' : 'غیرفعال',
            ],
        ]);
    }

    public function clear(string $type)
    {
        $messages = [
            'all' => 'همه‌ی کش‌ها پاک شدند',
            'config' => 'کش تنظیمات پاک شد',
            'cache' => 'کش اپلیکیشن پاک شد',
            'route' => 'کش route ها پاک شد',
            'view' => 'کش ویوها پاک شد',
        ];

        match($type) {
            'all' => function() {
                Artisan::call('optimize:clear');
                \App\Models\Setting::clearCache();
            },
            'config' => Artisan::call('config:clear'),
            'cache' => Artisan::call('cache:clear'),
            'route' => Artisan::call('route:clear'),
            'view' => Artisan::call('view:clear'),
            default => throw new \InvalidArgumentException('Invalid cache type'),
        };

        if ($type === 'all') {
            \App\Models\Setting::clearCache();
        }

        $this->logActivity('clear_cache', $messages[$type] ?? 'کش پاک شد');

        return back()->with('success', $messages[$type] ?? 'کش پاک شد!');
    }
}