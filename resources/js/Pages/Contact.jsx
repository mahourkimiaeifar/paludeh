import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
    const { props } = usePage();
    const flash = props.initialPage?.props?.flash || props.flash || {};

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    };

    const inputClass = (hasError) => `w-full rounded-xl border bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 ${
        hasError
            ? 'border-rose-400/60 focus:border-rose-500/60 focus:ring-rose-500/25'
            : 'border-slate-200 focus:border-cyan-500/60 focus:ring-cyan-500/25 dark:border-white/10 dark:focus:border-cyan-400/60 dark:focus:ring-cyan-400/25'
    }`;

    return (
        <PublicLayout>
            <Head title="تماس با ما | پالوده" />

            <div className="mx-auto max-w-4xl">
                {/* Success Message */}
                <AnimatePresence>
                    {flash?.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 flex items-center gap-3 rounded-2xl border border-green-400/30 bg-green-500/10 p-5 text-green-700 backdrop-blur-xl dark:text-green-300"
                        >
                            <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-medium">{flash.success}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <h1 className="mb-4 text-4xl font-black text-slate-900 dark:text-white md:text-6xl">
                        <span className="bg-gradient-to-l from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-400">
                            تماس با ما
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 md:text-xl">
                        سوالی داری؟ پیشنهادی داری؟ خوشحال می‌شیم ازت بشنویم! 💙
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-5">
                    {/* Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-4 lg:col-span-2"
                    >
                        <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-600/15 text-cyan-600 dark:text-cyan-300">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <h3 className="mb-1 font-bold text-slate-900 dark:text-white">ایمیل</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400" dir="ltr">contact@paludeh.com</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-600/15 text-purple-600 dark:text-purple-300">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-1 font-bold text-slate-900 dark:text-white">زمان پاسخگویی</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">معمولاً ظرف ۲۴ ساعت پاسخ می‌دهیم</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-600/15 text-emerald-600 dark:text-emerald-300">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-1 font-bold text-slate-900 dark:text-white">آدرس</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">تهران، ایران</p>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        onSubmit={submit}
                        className="space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-8 backdrop-blur-xl lg:col-span-3 dark:border-white/10 dark:bg-white/[0.06]"
                    >
                        {/* Error Summary */}
                        <AnimatePresence>
                            {Object.keys(errors).length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="mb-1 font-bold text-rose-600 dark:text-rose-300">لطفاً خطاهای زیر را برطرف کنید:</p>
                                            <ul className="space-y-1 text-sm text-rose-500 dark:text-rose-300">
                                                {Object.entries(errors).map(([field, error]) => (
                                                    <li key={field}>• {error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                نام و نام خانوادگی
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClass(errors.name)}
                                placeholder="مثلاً: مهدی رضایی"
                            />
                            {errors.name && (
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-300">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                ایمیل
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                dir="ltr"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={inputClass(errors.email)}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-300">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                موضوع
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="subject"
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                className={inputClass(errors.subject)}
                                placeholder="موضوع پیام شما..."
                            />
                            {errors.subject && (
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-300">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                                متن پیام
                                <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                id="message"
                                rows="6"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className={inputClass(errors.message)}
                                placeholder="پیام خود را بنویسید... (حداقل ۱۰ کاراکتر)"
                            />
                            <div className="mt-1 flex items-center justify-between">
                                {errors.message && (
                                    <p className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-300">
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                        {errors.message}
                                    </p>
                                )}
                                <span className={`text-xs ${data.message.length > 5000 ? 'text-rose-500' : data.message.length > 4000 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {data.message.length} / 5000
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
                                    ارسال پیام
                                </>
                            )}
                        </button>
                    </motion.form>
                </div>
            </div>
        </PublicLayout>
    );
}