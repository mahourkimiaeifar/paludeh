<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PageTemplate;

class PageTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'رویداد / همایش',
                'key' => 'event',
                'description' => 'قالب مخصوص معرفی رویدادها، کنفرانس‌ها و همایش‌ها',
                'icon' => '🎉',
                'sections' => [
                    ['key' => 'hero', 'name' => 'بخش اصلی', 'required' => true],
                    ['key' => 'event_info', 'name' => 'اطلاعات رویداد', 'required' => false],
                    ['key' => 'speakers', 'name' => 'سخنرانان', 'required' => false],
                    ['key' => 'schedule', 'name' => 'برنامه زمانی', 'required' => false],
                    ['key' => 'gallery', 'name' => 'گالری تصاویر', 'required' => false],
                    ['key' => 'faq', 'name' => 'سوالات متداول', 'required' => false],
                    ['key' => 'cta', 'name' => 'دکمه ثبت‌نام', 'required' => false],
                ],
            ],
            [
                'name' => 'معرفی محصول',
                'key' => 'product',
                'description' => 'قالب مخصوص معرفی محصولات و خدمات',
                'icon' => '🛍️',
                'sections' => [
                    ['key' => 'hero', 'name' => 'بخش اصلی', 'required' => true],
                    ['key' => 'features', 'name' => 'ویژگی‌ها', 'required' => false],
                    ['key' => 'specs', 'name' => 'مشخصات فنی', 'required' => false],
                    ['key' => 'gallery', 'name' => 'گالری تصاویر', 'required' => false],
                    ['key' => 'testimonials', 'name' => 'نظرات مشتریان', 'required' => false],
                    ['key' => 'pricing', 'name' => 'قیمت‌گذاری', 'required' => false],
                    ['key' => 'faq', 'name' => 'سوالات متداول', 'required' => false],
                    ['key' => 'cta', 'name' => 'دکمه خرید', 'required' => false],
                ],
            ],
            [
                'name' => 'گردونه شانس / مسابقه',
                'key' => 'wheel',
                'description' => 'قالب مخصوص مسابقات و کمپین‌های جایزه‌دار',
                'icon' => '🎁',
                'sections' => [
                    ['key' => 'hero', 'name' => 'بخش اصلی', 'required' => true],
                    ['key' => 'prizes', 'name' => 'جوایز', 'required' => false],
                    ['key' => 'rules', 'name' => 'قوانین مسابقه', 'required' => false],
                    ['key' => 'winners', 'name' => 'برندگان قبلی', 'required' => false],
                    ['key' => 'faq', 'name' => 'سوالات متداول', 'required' => false],
                    ['key' => 'cta', 'name' => 'دکمه شرکت', 'required' => false],
                ],
            ],
            [
                'name' => 'دوره آموزشی',
                'key' => 'course',
                'description' => 'قالب مخصوص معرفی دوره‌ها و کارگاه‌ها',
                'icon' => '📚',
                'sections' => [
                    ['key' => 'hero', 'name' => 'بخش اصلی', 'required' => true],
                    ['key' => 'curriculum', 'name' => 'سرفصل‌ها', 'required' => false],
                    ['key' => 'instructor', 'name' => 'مدرس', 'required' => false],
                    ['key' => 'testimonials', 'name' => 'نظرات دانش‌آموزان', 'required' => false],
                    ['key' => 'faq', 'name' => 'سوالات متداول', 'required' => false],
                    ['key' => 'cta', 'name' => 'دکمه ثبت‌نام', 'required' => false],
                ],
            ],
        ];

        foreach ($templates as $template) {
            PageTemplate::updateOrCreate(
                ['key' => $template['key']],
                $template
            );
        }
    }
}