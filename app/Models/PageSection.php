<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    protected $fillable = ['page_id', 'section_key', 'is_active', 'data', 'order'];

    protected $casts = [
        'is_active' => 'boolean',
        'data' => 'array',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(CustomPage::class, 'page_id');
    }
}