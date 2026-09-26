<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'description',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getActionLabelAttribute(): string
    {
        return match($this->action) {
            'create' => 'ساخت',
            'update' => 'ویرایش',
            'delete' => 'حذف',
            'login' => 'ورود',
            'logout' => 'خروج',
            'reply' => 'پاسخ',
            'clear_cache' => 'پاک کردن کش',
            'backup' => 'بکاپ‌گیری',
            default => $this->action,
        };
    }

    public function getActionIconAttribute(): string
    {
        return match($this->action) {
            'create' => '✨',
            'update' => '✏️',
            'delete' => '🗑️',
            'login' => '🔐',
            'logout' => '🚪',
            'reply' => '💬',
            'clear_cache' => '🧹',
            'backup' => '💾',
            default => '📝',
        };
    }
}