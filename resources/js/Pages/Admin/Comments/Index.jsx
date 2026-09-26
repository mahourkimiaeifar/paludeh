import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ comments, filters, stats }) {
    const { props } = usePage();
    const flash = props.initialPage?.props?.flash || props.flash || {};

    const toggleApprove = (id) => {
        router.post(`/admin/comments/${id}/approve`);
    };

    const deleteComment = (id) => {
        if (confirm('آیا مطمئن هستید؟')) {
            router.delete(`/admin/comments/${id}`);
        }
    };

    const filterTabs = [
        { key: 'all', label: 'همه', count: stats.total },
        { key: 'pending', label: 'در انتظار تأیید', count: stats.pending, highlight: stats.pending > 0 },
        { key: 'approved', label: 'تأیید شده', count: stats.approved },
    ];

    return (
        <AdminLayout title="مدیریت کامنت‌ها">
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mb-6 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-700 dark:text-green-300">
                        {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/70 p-2 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                {filterTabs.map((tab) => (
<button
    key={tab.key}
    onClick={() => router.get(`/admin/comments?status=${tab.key}`)}
    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        filters.status === tab.key
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
            : tab.highlight
            ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
    }`}
>
    {tab.label}
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
        filters.status === tab.key ? 'bg-white/20' : 'bg-slate-200 dark:bg-white/10'
    }`}>
        {tab.count}
    </span>
    {tab.highlight && tab.count > 0 && (
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
    )}
</button>
                ))}
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                        <p className="text-lg text-slate-500">کامنتی یافت نشد</p>
                    </div>
                ) : (
                    comments.data.map((comment, i) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                        >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 text-sm font-bold text-white">
                                        {comment.author_initial}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{comment.author_name}</p>
                                        <p className="text-xs text-slate-500">{comment.email} • {comment.created_at}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs text-slate-600 dark:text-slate-400">
                                        {comment.article_title}
                                    </span>
                                    {comment.is_reply && (
                                        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-600 dark:text-purple-300">
                                            پاسخ
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">{comment.content}</p>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => toggleApprove(comment.id)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${comment.is_approved
                                            ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300'
                                            : 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-300'
                                        }`}
                                >
                                    {comment.is_approved ? (
                                        <>
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                            لغو تأیید
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            تأیید
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => deleteComment(comment.id)}
                                    className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-300"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    حذف
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {comments.links && comments.links.length > 3 && (
                <div className="mt-6 flex justify-center gap-2">
                    {comments.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.get(link.url)}
                            disabled={!link.url}
                            className={`rounded-lg px-4 py-2 text-sm ${link.active
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