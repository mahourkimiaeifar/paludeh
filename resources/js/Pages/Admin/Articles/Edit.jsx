import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import RichTextEditor from '@/Components/RichTextEditor';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 transition-all focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-cyan-400/60 dark:focus:ring-cyan-400/25';
const labelClass = 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300';
const errorClass = 'mt-1.5 text-xs text-rose-500 dark:text-rose-300';

export default function Edit({ article }) {
    const { data, setData, put, processing, errors } = useForm({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content,
        featured_image: null,
        status: article.status,
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
    });
    const [confirming, setConfirming] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/articles/${article.id}`);
    };

    return (
        <AdminLayout title="ویرایش مقاله">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={submit}
                className="mx-auto max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none"
                encType="multipart/form-data"
            >
                <div>
                    <label htmlFor="title" className={labelClass}>عنوان مقاله</label>
                    <input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={inputClass}
                    />
                    {errors.title && <p className={errorClass}>{errors.title}</p>}
                </div>

                <div>
                    <label htmlFor="slug" className={labelClass}>Slug</label>
                    <input
                        id="slug"
                        type="text"
                        dir="ltr"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        className={inputClass}
                    />
                    {errors.slug && <p className={errorClass}>{errors.slug}</p>}
                </div>

                <div>
                    <label htmlFor="excerpt" className={labelClass}>خلاصه</label>
                    <textarea
                        id="excerpt"
                        rows="3"
                        value={data.excerpt}
                        onChange={(e) => setData('excerpt', e.target.value)}
                        className={inputClass}
                    />
                    {errors.excerpt && <p className={errorClass}>{errors.excerpt}</p>}
                </div>

                <div>
                    <label className={labelClass}>محتوای مقاله</label>
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                            <RichTextEditor
                                value={data.content}
                                onChange={(html) => setData('content', html)}
                                placeholder="محتوای مقاله رو اینجا بنویس..."
                            />
                    </div>
                    {errors.content && <p className={errorClass}>{errors.content}</p>}
                </div>

                <div>
                    <label htmlFor="featured_image" className={labelClass}>تصویر شاخص</label>
                    {article.featured_image && (
                        <div className="mb-3">
                            <img src={article.featured_image} alt="تصویر فعلی" className="h-32 rounded-lg object-cover" />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">تصویر فعلی</p>
                        </div>
                    )}
                    <input
                        id="featured_image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('featured_image', e.target.files[0])}
                        className={inputClass}
                    />
                    {errors.featured_image && <p className={errorClass}>{errors.featured_image}</p>}
                </div>

                <div>
                    <label htmlFor="status" className={labelClass}>وضعیت</label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className={inputClass}
                    >
                        <option value="draft" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">پیش‌نویس</option>
                        <option value="published" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">منتشرشده</option>
                    </select>
                </div>

                <div className="border-t border-slate-200 pt-6 dark:border-white/10">
                    <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">تنظیمات SEO</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="meta_title" className={labelClass}>عنوان متا</label>
                            <input
                                id="meta_title"
                                type="text"
                                value={data.meta_title}
                                onChange={(e) => setData('meta_title', e.target.value)}
                                className={inputClass}
                                maxLength="60"
                            />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {data.meta_title.length}/60 کاراکتر
                            </p>
                        </div>

                        <div>
                            <label htmlFor="meta_description" className={labelClass}>توضیحات متا</label>
                            <textarea
                                id="meta_description"
                                rows="3"
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                className={inputClass}
                                maxLength="160"
                            />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {data.meta_description.length}/160 کاراکتر
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                    >
                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <Link href="/admin/articles" className="rounded-xl border border-slate-200 bg-white/60 px-6 py-3 text-slate-600 transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">
                        انصراف
                    </Link>
                </div>

                <div className="border-t border-slate-200 pt-4 dark:border-white/10">
                    {confirming ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-rose-500 dark:text-rose-300">مطمئنی؟ این مقاله برای همیشه حذف میشه!</span>
                            <button type="button" onClick={() => router.delete(`/admin/articles/${article.id}`)} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-600">
                                بله، حذف کن
                            </button>
                            <button type="button" onClick={() => setConfirming(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
                                انصراف
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setConfirming(true)} className="rounded-xl border border-rose-300/50 bg-rose-500/10 px-4 py-2 text-sm text-rose-500 transition-all hover:bg-rose-500/20 dark:border-rose-400/30 dark:text-rose-300">
                            حذف این مقاله
                        </button>
                    )}
                </div>
            </motion.form>
        </AdminLayout>
    );
}