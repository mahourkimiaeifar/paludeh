import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const statusConfig = {
    new: { label: 'جدید', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-300', dot: 'bg-blue-500' },
    replied: { label: 'پاسخ داده شده', color: 'bg-green-500/10 text-green-600 border-green-500/30 dark:text-green-300', dot: 'bg-green-500' },
    closed: { label: 'بسته شده', color: 'bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-400', dot: 'bg-slate-500' },
};

export default function Show({ contact }) {
    const { props } = usePage();
    const flash = props.initialPage?.props?.flash || props.flash || {};
    const [showEmailPreview, setShowEmailPreview] = useState(false);
    const [fileName, setFileName] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        reply: contact.reply || '',
        attachment: null,
        status: contact.status,
    });

    const status = statusConfig[contact.status] || statusConfig.new;

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/contacts/${contact.id}/reply`, {
            preserveScroll: true,
        });
    };

    const deleteContact = () => {
        if (!contact?.id) {
            console.error('❌ contact.id is missing:', contact);
            alert('خطا: شناسه پیام یافت نشد!');
            return;
        }

        if (confirm('آیا مطمئن هستید؟ این پیام برای همیشه حذف می‌شود!')) {
            router.post(`/admin/contacts/${contact.id}/force-delete`);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('attachment', file);
        setFileName(file ? file.name : null);
    };

    return (
        <AdminLayout title="پاسخ به پیام">
            <AnimatePresence>
                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 flex items-center gap-3 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-700 dark:text-green-300"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Button */}
            <div className="mb-6">
                <Link href="/admin/contacts" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300">
                    <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    بازگشت به لیست پیام‌ها
                </Link>
            </div>

            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
            >
                <div className="relative overflow-hidden bg-gradient-to-l from-cyan-500/10 via-blue-500/10 to-indigo-500/10 px-6 py-5">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-black text-white shadow-lg shadow-cyan-500/30">
                                {contact.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">{contact.name}</h2>
                                <p className="text-sm text-slate-500" dir="ltr">{contact.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold ${status.color}`}>
                                <span className={`h-2 w-2 rounded-full ${status.dot} animate-pulse`} />
                                {status.label}
                            </span>
                            <button
                                onClick={deleteContact}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-500 transition-all hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-300 dark:hover:bg-rose-950/40"
                                title="حذف پیام"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 border-t border-slate-200 px-6 py-4 dark:border-white/10 sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span>تاریخ دریافت:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{contact.created_at}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                        <span>موضوع:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{contact.subject}</span>
                    </div>
                    {contact.replied_at && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>آخرین پاسخ:</span>
                            <span className="font-bold text-slate-900 dark:text-white">{contact.replied_at}</span>
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Original Message */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                >
                    <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">پیام اصلی</h3>
                    </div>
                    <div className="overflow-hidden p-6">
                        <div className="max-w-full overflow-x-auto rounded-xl bg-slate-50 p-5 dark:bg-white/5">
                            <p className="whitespace-pre-wrap break-words leading-relaxed text-slate-700 dark:text-slate-300" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {contact.message}
                            </p>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <span>ارسال شده توسط: <span className="font-bold text-slate-700 dark:text-slate-300">{contact.name}</span></span>
                            <span className="break-all" dir="ltr">{contact.email}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Reply Form */}
                <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={submit}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                >
                    <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-l from-cyan-500/5 to-blue-500/5 px-6 py-4 dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">پاسخ به پیام</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowEmailPreview(!showEmailPreview)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            پیش‌نمایش ایمیل
                        </button>
                    </div>

                    <div className="space-y-5 p-6">
                        {/* Previous Reply */}
                        {contact.reply && (
                            <div className="rounded-xl border border-green-400/30 bg-green-500/5 p-4">
                                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-300">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    پاسخ قبلی شما
                                </div>
                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                    {contact.reply}
                                </p>
                            </div>
                        )}

                        {/* Email Preview */}
                        <AnimatePresence>
                            {showEmailPreview && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                        <div className="mb-3 border-b border-slate-200 pb-3 text-xs dark:border-white/10">
                                            <p><span className="font-bold">به:</span> <span dir="ltr">{contact.email}</span></p>
                                            <p><span className="font-bold">موضوع:</span> پاسخ به: {contact.subject}</p>
                                        </div>
                                        <div className="rounded-lg bg-white p-4 text-sm dark:bg-slate-900/50">
                                            <p className="mb-2 font-bold text-slate-900 dark:text-white">سلام {contact.name} عزیز! 💙</p>
                                            <p className="mb-4 whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300">
                                                {data.reply || 'پاسخ خود را اینجا بنویسید...'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                با احترام،<br />
                                                <span className="font-bold text-cyan-600 dark:text-cyan-300">تیم پالوده</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reply Textarea */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                متن پاسخ
                                <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                rows="8"
                                value={data.reply}
                                onChange={(e) => setData('reply', e.target.value)}
                                className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 ${
                                    errors.reply
                                        ? 'border-rose-400/60 focus:border-rose-500/60 focus:ring-rose-500/25'
                                        : 'border-slate-200 focus:border-cyan-500/60 focus:ring-cyan-500/25 dark:border-white/10 dark:focus:border-cyan-400/60 dark:focus:ring-cyan-400/25'
                                }`}
                                placeholder="پاسخ خود را بنویسید... این متن به ایمیل کاربر ارسال می‌شود."
                            />
                            {errors.reply && (
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-300">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    {errors.reply}
                                </p>
                            )}
                        </div>

                        {/* Attachment */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                فایل پیوست (اختیاری)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="attachment"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="attachment"
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-6 text-sm text-slate-500 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5 dark:border-white/20 dark:bg-white/[0.02] dark:text-slate-400 dark:hover:border-cyan-400/50"
                                >
                                    {fileName ? (
                                        <>
                                            <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-medium text-cyan-600 dark:text-cyan-300">{fileName}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setData('attachment', null);
                                                    setFileName(null);
                                                }}
                                                className="text-rose-500 hover:text-rose-600"
                                            >
                                                ✕
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            برای انتخاب فایل کلیک کنید
                                        </>
                                    )}
                                </label>
                            </div>
                            {errors.attachment && (
                                <p className="mt-2 text-xs text-rose-500 dark:text-rose-300">{errors.attachment}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                وضعیت پیام
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(statusConfig).map(([key, cfg]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setData('status', key)}
                                        className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${
                                            data.status === key
                                                ? cfg.color + ' ring-2 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                                                : 'border-slate-200 bg-white/50 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-400'
                                        }`}
                                    >
                                        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                        {cfg.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? (
                                    <>
                                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        در حال ارسال...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                        ارسال پاسخ
                                    </>
                                )}
                            </button>
                            <Link
                                href="/admin/contacts"
                                className="rounded-xl border border-slate-200 bg-white/60 px-6 py-3.5 font-medium text-slate-600 transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                            >
                                انصراف
                            </Link>
                        </div>
                    </div>
                </motion.form>
            </div>
        </AdminLayout>
    );
}