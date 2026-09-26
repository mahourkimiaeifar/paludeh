import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const actionColors = {
    create: 'bg-green-500/10 text-green-600 dark:text-green-300 border-green-500/30',
    update: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30',
    delete: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30',
    login: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
    logout: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
    reply: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30',
    clear_cache: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30',
    backup: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/30',
};

export default function Index({ logs, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search);
    const [debounceTimer, setDebounceTimer] = useState(null);

    const handleSearch = (value) => {
        setSearch(value);
        clearTimeout(debounceTimer);
        setDebounceTimer(setTimeout(() => {
            router.get('/admin/activity-logs', { search: value, action: filters.action }, { preserveState: true });
        }, 400));
    };

    const filterByAction = (action) => {
        router.get('/admin/activity-logs', { action, search }, { preserveState: true });
    };

    const deleteLog = (id) => {
        if (confirm('آیا مطمئنی؟')) {
            router.delete(`/admin/activity-logs/${id}`);
        }
    };

    const clearOldLogs = () => {
        if (confirm('لاگ‌های قدیمی‌تر از ۳۰ روز پاک شوند؟')) {
            router.post('/admin/activity-logs/clear');
        }
    };

    return (
        <AdminLayout title="لاگ‌های سیستم">
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-600 dark:text-green-300">
                        {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'all', label: 'همه' },
                        { key: 'create', label: '✨ ساخت' },
                        { key: 'update', label: '✏️ ویرایش' },
                        { key: 'delete', label: '🗑️ حذف' },
                        { key: 'login', label: '🔐 ورود' },
                        { key: 'logout', label: '🚪 خروج' },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => filterByAction(f.key)}
                            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                                filters.action === f.key
                                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300'
                                    : 'border-slate-200 bg-white/50 text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="جستجو..."
                        className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm focus:border-cyan-500/50 focus:outline-none dark:border-white/10 dark:bg-white/5"
                    />
                    <button onClick={clearOldLogs} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-300">
                        🧹 پاکسازی قدیمی‌ها
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                        <tr>
                            <th className="px-6 py-4 text-right text-sm font-bold">عمل</th>
                            <th className="px-6 py-4 text-right text-sm font-bold">توضیح</th>
                            <th className="px-6 py-4 text-right text-sm font-bold">کاربر</th>
                            <th className="px-6 py-4 text-right text-sm font-bold">IP</th>
                            <th className="px-6 py-4 text-right text-sm font-bold">زمان</th>
                            <th className="px-6 py-4 text-right text-sm font-bold">حذف</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                        {logs.data.map((log, i) => (
                            <motion.tr
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${actionColors[log.action] || actionColors.create}`}>
                                        {log.action_icon} {log.action_label}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{log.description}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{log.user_name}</td>
                                <td className="px-6 py-4 text-xs text-slate-400" dir="ltr">{log.ip_address}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{log.created_at}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => deleteLog(log.id)} className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-500/20 dark:text-rose-300">
                                        حذف
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {logs.links && logs.links.length > 3 && (
                <div className="mt-6 flex justify-center gap-2">
                    {logs.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.get(link.url)}
                            disabled={!link.url}
                            className={`rounded-lg px-4 py-2 text-sm ${
                                link.active
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-white/50 text-slate-600 hover:bg-white dark:bg-white/5 dark:text-slate-400'
                            } disabled:opacity-50`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}