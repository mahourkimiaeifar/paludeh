<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'status',
        'reply',
        'attachment',
        'replied_at',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'new' => 'جدید',
            'replied' => 'پاسخ داده شده',
            'closed' => 'بسته شده',
            default => $this->status,
        };
    }
}