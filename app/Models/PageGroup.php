<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PageGroup extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function pages(): HasMany
    {
        return $this->hasMany(CustomPage::class, 'group_id')->where('status', 'published');
    }
}