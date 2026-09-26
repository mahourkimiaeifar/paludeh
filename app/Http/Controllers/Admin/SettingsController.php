<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    use LogsActivity;

    public function index()
    {
        // مستقیم از دیتابیس بخون، نه از کش
        $settings = Setting::allAsArray();
        
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:100',
            'site_description' => 'nullable|string|max:500',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'twitter' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'telegram' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'is_maintenance' => 'nullable|boolean',
            'allow_comments' => 'nullable|boolean',
        ]);

        // ذخیره هر تنظیم
        foreach ($validated as $key => $value) {
            $type = in_array($key, ['is_maintenance', 'allow_comments']) ? 'boolean' : 'string';
            Setting::set($key, $value ?? '', $type);
        }

        // پاک کردن کامل کش‌ها
        Setting::clearCache();

        // لاگ
        $this->logActivity('update', 'تنظیمات سایت بروزرسانی شد', Setting::class);

        return back()->with('success', 'تنظیمات با موفقیت ذخیره شد!');
    }
}