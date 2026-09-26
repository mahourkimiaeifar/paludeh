<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckMaintenance
{
    public function handle(Request $request, Closure $next)
    {
        // اگه حالت تعمیر فعاله
        if (Setting::get('is_maintenance', false)) {
            
            // مسیرهایی که همیشه دسترسی دارن
            $allowedPaths = [
                env('ADMIN_LOGIN_PATH', 'login'),
                'admin',
                'logout',
                'maintenance',
                'up',
            ];

            foreach ($allowedPaths as $path) {
                if ($request->is($path) || $request->is($path . '/*')) {
                    return $next($request);
                }
            }

            // اگه کاربر لاگین هست و ادمینه
            if (Auth::check() && Auth::user()->hasAnyRole(['super_admin', 'content_manager', 'support'])) {
                return $next($request);
            }

            // ریدایرکت به صفحه حالت تعمیر
            if ($request->route() && $request->route()->getName() !== 'maintenance') {
                return redirect()->route('maintenance');
            }
        }

        return $next($request);
    }
}