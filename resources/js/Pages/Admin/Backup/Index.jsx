import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Index({ backups, disk_info }) {
    const { props } = usePage();
    const flash = props.initialPage?.props?.flash || props.flash || {};
    const [creating, setCreating] = useState(null);

    const createBackup = (type) => {
        const messages = {
            database: 'آیا مطمئن هستید؟ بکاپ دیتابیس ساخته خواهد شد.',
            files: 'آیا مطمئن هستید؟ بکاپ فایل‌ها ساخته خواهد شد.',
            full: 'آیا مطمئن هستید؟ بکاپ کامل (دیتابیس + فایل‌ها) ساخته خواهد شد. این عمل ممکن است زمان‌بر باشد.',
        };

        if (!confirm(messages[type])) return;

        setCreating(type);
        router.post('/admin/backup/create', { type }, {
            onFinish: () => setCreating(null),
        });
    };

    const downloadBackup = (filename) => {
        window.location.href = `/admin/backup/download/${filename}`;
    };

    const deleteBackup = (filename) => {
        if (!confirm(`آیا مطمئن هستید؟ بکاپ "${filename}" حذف خواهد شد!`)) return;
        router.delete(`/admin/backup/${filename}`);
    };

    const backupTypes = [
        {
            type: 'database',
            title: 'بکاپ دیتابیس',
            desc: 'فقط جداول و داده‌های دیتابیس',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
            ),
            color: 'from-blue-500 to-cyan-500',
        },
        {
            type: 'files',
            title: 'بکاپ فایل‌ها',
            desc: 'فایل‌های آپلود شده (تصاویر، مستندات)',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
            ),
            color: 'from-purple-500 to-pink-500',
        },
        {
            type: 'full',
            title: 'بکاپ کامل',
            desc: 'دیتابیس + تمام فایل‌ها',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <AdminLayout title="بکاپ‌گیری">
            {/* Flash Messages */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mb-6 flex items-center gap-3 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-700 dark:text-green-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </motion.div>
                )}
                {flash?.error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mb-6 flex items-center gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-700 dark:text-rose-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <span className="font-medium">{flash.error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Disk Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">فضای دیسک</h2>
                        <p className="text-sm text-slate-500">
                            {disk_info.free} آزاد از {disk_info.total} ({disk_info.used_percent}% استفاده شده)
                        </p>
                    </div>
                    <div className="h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${disk_info.used_percent}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full rounded-full ${
                                disk_info.used_percent > 80 ? 'bg-rose-500' : disk_info.used_percent > 60 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Backup Types */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
                {backupTypes.map((item, i) => (
                    <motion.div
                        key={item.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                    >
                        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                            {item.icon}
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="mb-4 text-sm text-slate-500">{item.desc}</p>
                        <button
                            onClick={() => createBackup(item.type)}
                            disabled={creating === item.type}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${item.color} py-3 font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-60`}
                        >
                            {creating === item.type ? (
                                <>
                                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    در حال ساخت...
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    ساخت بکاپ
                                </>
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Backup List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                    <h3 className="font-bold text-slate-900 dark:text-white">لیست بکاپ‌ها</h3>
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                        {backups.length} بکاپ
                    </span>
                </div>

                {backups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <svg className="mb-4 h-16 w-16 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25m-2.25 2.25v-6m-7.5 2.25h15" />
                        </svg>
                        <p className="text-lg font-medium text-slate-500">هنوز بکاپی ساخته نشده</p>
                        <p className="text-sm text-slate-400">از دکمه‌های بالا برای ساخت اولین بکاپ استفاده کنید</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">فایل</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">نوع</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">حجم</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">تاریخ</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {backups.map((backup, i) => (
                                <motion.tr
                                    key={backup.filename}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-slate-700 dark:text-slate-300" dir="ltr">
                                            {backup.filename}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                                            backup.type === 'database'
                                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300'
                                                : 'bg-purple-500/10 text-purple-600 dark:text-purple-300'
                                        }`}>
                                            {backup.type === 'database' ? 'دیتابیس' : 'فایل‌ها'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{backup.size}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{backup.created_at}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => downloadBackup(backup.filename)}
                                                className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-600 transition-colors hover:bg-cyan-500/20 dark:text-cyan-300"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                                دانلود
                                            </button>
                                            <button
                                                onClick={() => deleteBackup(backup.filename)}
                                                className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500/20 dark:text-rose-300"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                                حذف
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </motion.div>
        </AdminLayout>
    );
}   