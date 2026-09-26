import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ pages }) {
    const { flash } = usePage().props;

    const deletePage = (id) => {
        if (confirm('آیا مطمئنی؟ این صفحه برای همیشه حذف میشه!')) {
            router.delete(`/admin/pages/${id}`);
        }
    };

    return (
        <AdminLayout title="مدیریت صفحات">
            <AnimatePresence>
                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 flex items-center gap-3 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-600 dark:text-green-300"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{flash.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {pages.length} صفحه
                </p>
                <Link
                    href="/admin/pages/create"
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110"
                >
                    <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    صفحه جدید
                </Link>
            </div>

            {pages.length === 0 ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-12 dark:border-white/10">
                    <p className="text-xl text-slate-600 dark:text-slate-400">هنوز صفحه‌ای نساختی!</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">عنوان</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">Slug</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">وضعیت</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">تاریخ</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {pages.map((page, i) => (
                                <motion.tr
                                    key={page.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{page.title}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400" dir="ltr">/{page.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs ${page.is_published ? 'bg-green-500/10 text-green-600 dark:text-green-300' : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'}`}>
                                            {page.is_published ? 'منتشرشده' : 'پیش‌نویس'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{page.created_at}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/pages/${page.id}/edit`} className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-500/20 dark:text-blue-300">
                                                ویرایش
                                            </Link>
                                            <button onClick={() => deletePage(page.id)} className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-500/20 dark:text-rose-300">
                                                حذف
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}