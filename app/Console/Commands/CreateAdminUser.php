<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    /**
     * نام و امضای دستور در ترمینال
     */
    protected $signature = 'user:create-admin {--email=} {--name=} {--password=}';

    /**
     * توضیحات دستور
     */
    protected $description = 'ساخت کاربر ادمین با مشخصات دلخواه یا به صورت تعاملی';

    public function handle()
    {
        // دریافت ورودی‌ها از آرگومان‌ها یا پرسش تعاملی
        $email = $this->option('email') ?? $this->ask('ایمیل کاربر را وارد کنید:');
        $name = $this->option('name') ?? $this->ask('نام کاربر را وارد کنید:');
        $password = $this->option('password') ?? $this->secret('رمز عبور را وارد کنید:');

        // اعتبارسنجی ساده
        $validator = Validator::make([
            'email' => $email,
            'name' => $name,
            'password' => $password,
        ], [
            'email' => 'required|email|unique:users',
            'name' => 'required|string|max:255',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        // ساخت کاربر
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'email_verified_at' => now(), // تایید شده فرض می‌شود
            'password' => Hash::make($password),
        ]);

        // اختصاص نقش ادمین
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $user->roles()->attach($adminRole);
            $this->info("✅ نقش 'admin' با موفقیت به کاربر اختصاص یافت.");
        } else {
            $this->warn("⚠️ نقش 'admin' یافت نشد. لطفاً ابتدا سیدر را اجرا کنید.");
        }

        $this->info("✅ کاربر ادمین با موفقیت ساخته شد!");
        $this->table(['Field', 'Value'], [
            ['Name', $user->name],
            ['Email', $user->email],
            ['Role', 'admin'],
        ]);

        return 0;
    }
}