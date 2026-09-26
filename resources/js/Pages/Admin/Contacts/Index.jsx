import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
    new: { label: 'جدید', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-300' },
    replied: { label: 'پاسخ داده شده', color: 'bg-green-500/10 text-green-600 border-green-500/30 dark:text-green-300' },
    closed: { label: 'بسته شده', color: 'bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-400' },
};

export default function Index({ contacts, filters, stats }) {
    const { props } = usePage();
    const flash = props.initialPage?.props?.flash || props.flash || {};

    // Safety checks
    const contactsList = contacts?.data || [];
    const contactsLinks = contacts?.links || [];
    const totalStats = stats || { total: 0, new: 0, replied: 0 };

    const deleteContact = (id) => {
        if (confirm('آیا مطمئن هستید؟ این پیام برای همیشه حذف می‌شود!')) {
            router.post(`/admin/contacts/${id}/force-delete`);
        }
    };

    const filterTabs = [
        { key: 'all', label: 'همه', count: totalStats.total },
        { key: 'new', label: 'جدید', count: totalStats.new, highlight: totalStats.new > 0 },
        { key: 'replied', label: 'پاسخ داده شده', count: totalStats.replied },
    ];

    return (
        <AdminLayout title="پیام‌های تماس">
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
            </AnimatePresence>

            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/70 p-2 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => router.get(`/admin/contacts?status=${tab.key}`)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                            filters?.status === tab.key
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                                : tab.highlight
                                ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-300'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                        }`}
                    >
                        {tab.label}
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            filters?.status === tab.key ? 'bg-white/20' : 'bg-slate-200 dark:bg-white/10'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Contacts List */}
            <div className="space-y-4">
                {contactsList.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
                        <p className="text-lg text-slate-500">پیامی یافت نشد</p>
                    </div>
                ) : (
                    contactsList.map((contact, i) => {
                        const status = statusConfig[contact.status] || statusConfig.new;
                        return (
                            <motion.div
                                key={contact.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="rounded-2xl border border-slate-200 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                            >
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{contact.name}</p>
                                            <p className="text-xs text-slate-500" dir="ltr">{contact.email} • {contact.created_at}</p>
                                        </div>
                                    </div>
                                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                <h3 className="mb-2 font-bold text-slate-900 dark:text-white">{contact.subject}</h3>
                                <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{contact.message}</p>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/contacts/${contact.id}`}
                                        className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-600 hover:bg-cyan-500/20 dark:text-cyan-300"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        مشاهده و پاسخ
                                    </Link>
                                    <button
                                        onClick={() => deleteContact(contact.id)}
                                        className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-300"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                        حذف
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {contactsLinks.length > 3 && (
                <div className="mt-6 flex justify-center gap-2">
                    {contactsLinks.map((link, i) => (
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