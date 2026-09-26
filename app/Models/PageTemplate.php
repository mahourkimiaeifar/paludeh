<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageTemplate extends Model
{
    protected $fillable = ['name', 'key', 'description', 'icon', 'preview_image', 'sections', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'sections' => 'array',
    ];
}