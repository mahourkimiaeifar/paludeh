<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ═══ گروه‌های صفحه (منوهای دراپ‌داون) ═══
        Schema::create('page_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');              // نام گروه: "رویدادها"
            $table->string('slug')->unique();    // آدرس: "events"
            $table->string('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ═══ صفحات سفارشی ═══
        Schema::create('custom_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('group_id')->nullable()->constrained('page_groups')->onDelete('set null');
            $table->string('template');          // event, product, wheel, ...
            $table->string('status')->default('draft'); // draft, published
            $table->string('color_theme')->default('cyan'); // cyan, blue, purple, emerald, rose
            
            // سئو
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('seo_keywords')->nullable();
            $table->string('og_image')->nullable();
            $table->integer('seo_score')->default(0);
            
            // اطلاعات
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'published_at']);
            $table->index('group_id');
        });

        // ═══ داده‌های بخش‌های صفحه ═══
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('custom_pages')->onDelete('cascade');
            $table->string('section_key');       // hero, event_info, speakers, ...
            $table->boolean('is_active')->default(true);
            $table->json('data')->nullable();    // داده‌های هر بخش
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index(['page_id', 'section_key']);
        });

        // ═══ لیست قالب‌های موجود ═══
        Schema::create('page_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');              // "رویداد"
            $table->string('key')->unique();     // "event"
            $table->string('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('preview_image')->nullable();
            $table->json('sections');            // لیست بخش‌های این قالب
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('custom_pages');
        Schema::dropIfExists('page_templates');
        Schema::dropIfExists('page_groups');
    }
};