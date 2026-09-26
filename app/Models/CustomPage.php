<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomPage extends Model
{
    protected $fillable = [
        'title', 'slug', 'group_id', 'template', 'status', 'color_theme',
        'seo_title', 'seo_description', 'seo_keywords', 'og_image', 'seo_score',
        'created_by', 'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(PageGroup::class, 'group_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class, 'page_id')->orderBy('order');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getSectionData(string $key): array
    {
        return $this->sections->firstWhere('section_key', $key)?->data ?? [];
    }

    public function isSectionActive(string $key): bool
    {
        return $this->sections->firstWhere('section_key', $key)?->is_active ?? false;
    }

    public function getTemplateLabelAttribute(): string
    {
        return match($this->template) {
            'event' => 'رویداد',
            'product' => 'معرفی محصول',
            'wheel' => 'گردونه شانس',
            'course' => 'دوره آموزشی',
            'team' => 'معرفی تیم',
            'company' => 'معرفی شرکت',
            'app' => 'معرفی اپلیکیشن',
            'landing' => 'لندینگ کمپین',
            'news' => 'خبر / اطلاعیه',
            'portfolio' => 'پورتفولیو',
            default => $this->template,
        };
    }
}