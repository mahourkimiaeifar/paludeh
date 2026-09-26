import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import RichTextEditor from '@/Components/RichTextEditor';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 transition-all focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-cyan-400/60 dark:focus:ring-cyan-400/25';
const labelClass = 'mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300';
const errorClass = 'mt-1.5 text-xs text-rose-500 dark:text-rose-300';

export default function Edit({ page }) {
    const { data, setData, put, processing, errors } = useForm({
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        is_published: Boolean(page.is_published),
    });
    const [confirming, setConfirming] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/pages/${page.id}`);
    };

    return (
        <AdminLayout title="ویرایش صفحه">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={submit}
                className="grid gap-6 lg:grid-cols-3"
            >
                {/* ستون اصلی */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                            <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            محتوای صفحه
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className={labelClass}>
                                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                    عنوان صفحه
                                </label>
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
                                <label htmlFor="slug" className={labelClass}>
                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                    Slug (آدرس URL)
                                </label>
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
                                <label className={labelClass}>
                                    <span className="h-2 w-2 rounded-full bg-pink-500" />
                                    محتوای صفحه
                                </label>
                                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={(html) => setData('content', html)}
                                    />
                                </div>
                                {errors.content && <p className={errorClass}>{errors.content}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* سایدبار */}
                <div className="space-y-6">
                    {/* وضعیت */}
                    <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                            <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            </svg>
                            تنظیمات
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    صفحه منتشرشده باشد
                                </label>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={data.is_published}
                                    onClick={() => setData('is_published', !data.is_published)}
                                    className={`relative h-7 w-12 rounded-full transition-colors ${data.is_published ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${data.is_published ? 'right-1' : 'right-6'}`} />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {data.is_published
                                    ? '✅ این صفحه در سایت قابل دسترسی است'
                                    : '🚫 این صفحه مخفی است و فقط شما می‌بینیدش'}
                            </p>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                            <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            تنظیمات SEO
                        </h2>

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
                                <div className="mt-1 flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">حداکثر ۶۰ کاراکتر</span>
                                    <span className={data.meta_title.length > 50 ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}>
                                        {data.meta_title.length}/60
                                    </span>
                                </div>
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
                                <div className="mt-1 flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">حداکثر ۱۶۰ کاراکتر</span>
                                    <span className={data.meta_description.length > 140 ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}>
                                        {data.meta_description.length}/160
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                        >
                            {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                        <Link href="/admin/pages" className="rounded-xl border border-slate-200 bg-white/60 px-6 py-3 text-slate-600 transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">
                            انصراف
                        </Link>
                    </div>

                    {/* حذف */}
                    <div className="rounded-2xl border border-rose-200/50 bg-rose-50/50 p-6 dark:border-rose-500/20 dark:bg-rose-950/20">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-300">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            ناحیه خطر
                        </h3>
                        {confirming ? (
                            <div className="space-y-3">
                                <p className="text-sm text-rose-600 dark:text-rose-300">
                                    مطمئنی؟ این صفحه برای همیشه حذف میشه!
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => router.delete(`/admin/pages/${page.id}`)}
                                        className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-rose-600"
                                    >
                                        بله، حذف کن
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirming(false)}
                                        className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-600 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                                    >
                                        انصراف
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setConfirming(true)}
                                className="w-full rounded-xl border border-rose-300 bg-white py-2.5 text-sm font-medium text-rose-600 transition-all hover:bg-rose-50 dark:border-rose-500/30 dark:bg-white/5 dark:text-rose-300 dark:hover:bg-rose-500/10"
                            >
                                حذف این صفحه
                            </button>
                        )}
                    </div>
                </div>
            </motion.form>
        </AdminLayout>
    );
}