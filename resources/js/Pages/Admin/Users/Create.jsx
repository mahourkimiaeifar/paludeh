import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3.5 text-slate-900 transition-all focus:border-cyan-500/60 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-cyan-400/60 dark:focus:ring-cyan-400/10';
const labelClass = 'mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300';
const errorClass = 'mt-2 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-300';

const rolesConfig = {
    super_admin: { label: 'سوپر ادمین', description: 'دسترسی کامل به همه‌ی بخش‌ها', icon: '👑', color: 'from-purple-500 to-pink-600', badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30' },
    content_manager: { label: 'مدیر محتوا', description: 'مدیریت مقالات و صفحات', icon: '📝', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30' },
    support: { label: 'پشتیبانی', description: 'پاسخ به پیام‌های کاربران', icon: '💬', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30' },
    user: { label: 'کاربر عادی', description: 'دسترسی محدود به پروفایل', icon: '👤', color: 'from-slate-500 to-slate-600', badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30' },
};

export default function Create({ roles }) {
    const { errors: serverErrors } = usePage().props;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        is_active: true,
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);

    // ادغام ارورهای سرور و فرم
    const allErrors = { ...errors, ...serverErrors };

    const passwordStrength = useMemo(() => {
        const pwd = data.password;
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return Math.min(4, Math.floor(score / 1.5));
    }, [data.password]);

    const strengthLabels = ['خیلی ضعیف', 'ضعیف', 'متوسط', 'قوی', 'عالی'];
    const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

    const initials = useMemo(() => {
        return data.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase() || '؟';
    }, [data.name]);

    const selectedRole = rolesConfig[data.role] || rolesConfig.user;

    const submit = (e) => {
        e.preventDefault();
        console.log('🚀 Submitting user data:', data);
        
        post('/admin/users', {
            onSuccess: () => {
                console.log('✅ User created successfully!');
                reset();
            },
            onError: (errors) => {
                console.error('❌ Server errors:', errors);
            },
            onFinish: () => {
                console.log('🏁 Request finished');
            },
        });
    };

    const canGoNext = step === 1 ? data.name.trim() && data.email.trim() : true;

    return (
        <AdminLayout title="کاربر جدید">
            <div className="mx-auto max-w-5xl">
                {/* Server Errors Alert */}
                <AnimatePresence>
                    {Object.keys(allErrors).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-6 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4"
                        >
                            <div className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="mb-1 font-bold text-rose-600 dark:text-rose-300">خطا در ذخیره‌سازی:</p>
                                    <ul className="space-y-1 text-sm text-rose-500 dark:text-rose-300">
                                        {Object.entries(allErrors).map(([field, error]) => (
                                            <li key={field}>• {error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <h2 className="mb-2 text-3xl font-black text-slate-900 dark:text-white">ساخت کاربر جدید</h2>
                    <p className="text-slate-600 dark:text-slate-400">یک کاربر جدید به پالوده اضافه کن</p>
                </motion.div>

                {/* Step Indicator */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => s === 1 && setStep(1)}
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                                    step === s
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                                        : step > s
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                }`}
                            >
                                {step > s ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                ) : s}
                            </button>
                            {s === 1 && <div className={`h-1 w-16 rounded-full transition-colors ${step > 1 ? 'bg-green-500' : 'bg-slate-200 dark:bg-white/10'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Preview Card */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
                        <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                            <div className={`h-24 bg-gradient-to-r ${selectedRole.color} relative`}>
                                <div className="absolute -bottom-12 right-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-3xl font-black text-slate-900 shadow-xl ring-4 ring-white dark:ring-slate-900">
                                    {initials}
                                </div>
                            </div>
                            <div className="px-6 pb-6 pt-16">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{data.name || 'نام کاربر'}</h3>
                                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${selectedRole.badge}`}>
                                        {selectedRole.icon} {selectedRole.label}
                                    </span>
                                </div>
                                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400" dir="ltr">{data.email || 'user@example.com'}</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/5">
                                        <span className="text-slate-500 dark:text-slate-400">وضعیت</span>
                                        <span className={`font-bold ${data.is_active ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                            {data.is_active ? '● فعال' : '● غیرفعال'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/5">
                                        <span className="text-slate-500 dark:text-slate-400">نقش</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{selectedRole.label}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/5">
                                        <span className="text-slate-500 dark:text-slate-400">قدرت رمز</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{data.password ? strengthLabels[passwordStrength] : '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={submit} className="space-y-6 lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">اطلاعات پایه</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">نام و ایمیل کاربر</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="name" className={labelClass}>
                                            <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                            نام کامل
                                        </label>
                                        <input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={`${inputClass} ${allErrors.name ? 'border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/10' : ''}`} placeholder="مثلاً: مهدی رضایی" />
                                        {allErrors.name && (
                                            <p className={errorClass}>
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                </svg>
                                                {allErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className={labelClass}>
                                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            آدرس ایمیل
                                        </label>
                                        <input id="email" type="email" dir="ltr" value={data.email} onChange={(e) => setData('email', e.target.value)} className={`${inputClass} ${allErrors.email ? 'border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/10' : ''}`} placeholder="user@example.com" />
                                        {allErrors.email && (
                                            <p className={errorClass}>
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                </svg>
                                                {allErrors.email}
                                            </p>
                                        )}
                                    </div>

                                    <button type="button" onClick={() => setStep(2)} disabled={!canGoNext}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                                        ادامه به رمز عبور
                                        <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">امنیت و دسترسی</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">رمز عبور و نقش کاربری</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setStep(1)} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">← بازگشت</button>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className={labelClass}>
                                            <span className="h-2 w-2 rounded-full bg-purple-500" />
                                            رمز عبور
                                        </label>
                                        <div className="relative">
                                            <input id="password" type={showPassword ? 'text' : 'password'} dir="ltr" value={data.password} onChange={(e) => setData('password', e.target.value)} className={`${inputClass} ${allErrors.password ? 'border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/10' : ''} pl-12`} placeholder="••••••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                {showPassword ? '🙈' : '👁️'}
                                            </button>
                                        </div>
                                        {data.password && (
                                            <div className="mt-3 space-y-2">
                                                <div className="flex gap-1.5">
                                                    {[0, 1, 2, 3].map((i) => (
                                                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < passwordStrength ? strengthColors[passwordStrength] : 'bg-slate-200 dark:bg-white/10'}`} />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">قدرت رمز: <span className="font-bold">{strengthLabels[passwordStrength]}</span></p>
                                            </div>
                                        )}
                                        {allErrors.password && (
                                            <p className={errorClass}>
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                </svg>
                                                {allErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className={labelClass}>
                                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                                            تکرار رمز عبور
                                        </label>
                                        <input id="password_confirmation" type="password" dir="ltr" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className={inputClass} placeholder="••••••••••••" />
                                        {data.password_confirmation && data.password !== data.password_confirmation && (
                                            <p className="mt-2 text-xs text-rose-500">❌ رمزها با هم مطابقت ندارند</p>
                                        )}
                                        {data.password_confirmation && data.password === data.password_confirmation && (
                                            <p className="mt-2 text-xs text-green-600 dark:text-green-400">✅ رمزها مطابقت دارند</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                                            نقش کاربری
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(rolesConfig).map(([key, role]) => (
                                                <button key={key} type="button" onClick={() => setData('role', key)}
                                                    className={`relative overflow-hidden rounded-xl border-2 p-4 text-right transition-all ${data.role === key ? 'border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'}`}>
                                                    {data.role === key && (
                                                        <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white">
                                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="mb-2 text-2xl">{role.icon}</div>
                                                    <p className="mb-1 text-sm font-bold text-slate-900 dark:text-white">{role.label}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{role.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">حساب فعال باشد</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">کاربر می‌تواند وارد سایت شود</p>
                                        </div>
                                        <button type="button" role="switch" aria-checked={data.is_active} onClick={() => setData('is_active', !data.is_active)}
                                            className={`relative h-8 w-14 rounded-full transition-colors ${data.is_active ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                            <span className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-all ${data.is_active ? 'right-1' : 'right-7'}`}>
                                                {data.is_active ? '✓' : '✕'}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" disabled={processing}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
                                            {processing ? (
                                                <>
                                                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    در حال ساخت...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                                    </svg>
                                                    ساخت کاربر
                                                </>
                                            )}
                                        </button>
                                        <Link href="/admin/users" className="rounded-xl border border-slate-200 bg-white/60 px-6 py-3.5 text-slate-600 transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">انصراف</Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.form>
                </div>
            </div>
        </AdminLayout>
    );
}