<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InitialDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. ساخت نقش‌ها
        $roles = ['admin', 'content_manager', 'support', 'user'];
        
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // 2. ساخت کاربر ادمین
        $admin = User::firstOrCreate(
            ['email' => 'admin@paludeh.com'],
            [
                'name' => 'مدیر کل',
                'email_verified_at' => now(),
                'password' => Hash::make('password'), // رمز عبور پیش‌فرض
                'remember_token' => Str::random(10),
            ]
        );

        // اختصاص نقش ادمین به کاربر
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole && !$admin->roles->contains($adminRole)) {
            $admin->roles()->attach($adminRole);
        }

        // 3. تنظیمات اولیه سایت (فوتر، تماس و...)
        $settings = [
            'site_name' => 'پالوده',
            'site_description' => 'وبسایت خلاقانه با تکنولوژی سه‌بعدی',
            'footer_phone' => '021-12345678',
            'footer_email' => 'info@paludeh.com',
            'footer_address' => 'تهران، خیابان خلاقیت، پلاک ۱',
            'copyright_text' => 'تمامی حقوق محفوظ است © ۱۴۰۳',
            'social_instagram' => '#',
            'social_twitter' => '#',
            'social_linkedin' => '#',
            'is_maintenance_mode' => false,
        ];

        foreach ($settings as $key => $value) {
            Setting::firstOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->command->info('✅ داده‌های اولیه با موفقیت ساخته شدند!');
        $this->command->info('👤 ادمین پیش‌فرض:');
        $this->command->info('   ایمیل: admin@paludeh.com');
        $this->command->info('   رمز عبور: password');
    }
}