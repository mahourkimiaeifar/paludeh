<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'type'];

    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) return $default;

        return match($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($setting->value, true),
            default => $setting->value,
        };
    }

    public static function set(string $key, $value, string $type = 'string'): void
    {
        // تبدیل مقدار به رشته
        $storedValue = match($type) {
            'boolean' => $value ? '1' : '0',
            'json' => is_array($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : $value,
            default => (string) $value,
        };

        static::updateOrCreate(
            ['key' => $key],
            ['value' => $storedValue, 'type' => $type]
        );

        // پاک کردن کش‌های مرتبط
        Cache::forget('setting.' . $key);
        Cache::forget('settings.all');
    }

    public static function allAsArray(): array
    {
        return static::all()->mapWithKeys(function ($setting) {
            $value = match($setting->type) {
                'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
                'json' => json_decode($setting->value, true),
                default => $setting->value,
            };
            return [$setting->key => $value];
        })->toArray();
    }

    public static function clearCache(): void
    {
        Cache::forget('settings.all');
        foreach (static::pluck('key') as $key) {
            Cache::forget('setting.' . $key);
        }
    }
}