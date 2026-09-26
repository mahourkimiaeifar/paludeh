import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-all focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500';
const labelClass = 'mb-2 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300';

const tabs = [
    { id: 'general', label: 'عمومی', icon: 'settings' },
    { id: 'contact', label: 'تماس', icon: 'contacts' },
    { id: 'social', label: 'شبکه‌های اجتماعی', icon: 'articles' },
    { id: 'system', label: 'سیستم', icon: 'logs' },
];

export default function Index({ settings }) {
    const { props } = usePage();
    const flash = props.initialPage?.props?.flash || props.flash || {};
    const [activeTab, setActiveTab] = useState('general');

    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name || 'پالوده',
        site_description: settings.site_description || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        address: settings.address || '',
        twitter: settings.twitter || '',
        instagram: settings.instagram || '',
        telegram: settings.telegram || '',
        linkedin: settings.linkedin || '',
        is_maintenance: settings.is_maintenance || false,
        allow_comments: settings.allow_comments !== false,
    });

    const submit = (e) => {
        e.preventDefault();
        put('/admin/settings', {
            preserveScroll: true,
            onSuccess: () => {
                console.log('✅ Settings saved successfully');
            },
            onError: (errors) => {
                console.error('❌ Settings save errors:', errors);
            },
        });
    };

    return (
        <AdminLayout title="تنظیمات سایت">
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

            {/* Tabs */}
            <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/70 p-2 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                        <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">تنظیمات عمومی</h3>
                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>
                                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                                    نام سایت
                                </label>
                                <input type="text" value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} className={inputClass} placeholder="پالوده" />
                                {errors.site_name && <p className="mt-1 text-xs text-rose-500">{errors.site_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>
                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                    توضیحات سایت
                                </label>
                                <textarea rows="3" value={data.site_description} onChange={(e) => setData('site_description', e.target.value)} className={inputClass} placeholder="جایی که دانش و هوش مصنوعی به هم می‌رسن" />
                                {errors.site_description && <p className="mt-1 text-xs text-rose-500">{errors.site_description}</p>}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                        <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">اطلاعات تماس</h3>
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>ایمیل تماس</label>
                                <input type="email" dir="ltr" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} className={inputClass} placeholder="contact@example.com" />
                                {errors.contact_email && <p className="mt-1 text-xs text-rose-500">{errors.contact_email}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>تلفن تماس</label>
                                <input type="text" dir="ltr" value={data.contact_phone} onChange={(e) => setData('contact_phone', e.target.value)} className={inputClass} placeholder="+98 21 1234 5678" />
                                {errors.contact_phone && <p className="mt-1 text-xs text-rose-500">{errors.contact_phone}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>آدرس</label>
                                <input type="text" value={data.address} onChange={(e) => setData('address', e.target.value)} className={inputClass} placeholder="تهران، ایران" />
                                {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Social Tab */}
                {activeTab === 'social' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                        <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">شبکه‌های اجتماعی</h3>
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>توییتر</label>
                                <input type="text" dir="ltr" value={data.twitter} onChange={(e) => setData('twitter', e.target.value)} className={inputClass} placeholder="https://twitter.com/paludeh" />
                            </div>
                            <div>
                                <label className={labelClass}>اینستاگرام</label>
                                <input type="text" dir="ltr" value={data.instagram} onChange={(e) => setData('instagram', e.target.value)} className={inputClass} placeholder="https://instagram.com/paludeh" />
                            </div>
                            <div>
                                <label className={labelClass}>تلگرام</label>
                                <input type="text" dir="ltr" value={data.telegram} onChange={(e) => setData('telegram', e.target.value)} className={inputClass} placeholder="https://t.me/paludeh" />
                            </div>
                            <div>
                                <label className={labelClass}>لینکدین</label>
                                <input type="text" dir="ltr" value={data.linkedin} onChange={(e) => setData('linkedin', e.target.value)} className={inputClass} placeholder="https://linkedin.com/company/paludeh" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">

                        {/* Maintenance Alert */}
                        {data.is_maintenance && (
                            <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <p className="text-sm font-medium">حالت تعمیر فعال است! سایت برای بازدیدکنندگان غیرقابل دسترس است.</p>
                            </div>
                        )}
                        <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">تنظیمات سیستم</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">حالت تعمیر و نگهداری</p>
                                    <p className="text-sm text-slate-500">سایت برای بازدیدکنندگان غیرقابل دسترس می‌شود</p>
                                </div>
                                <button type="button" onClick={() => setData('is_maintenance', !data.is_maintenance)}
                                    className={`relative h-8 w-14 rounded-full transition-colors ${data.is_maintenance ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                    <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${data.is_maintenance ? 'right-1' : 'right-7'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">اجازه ثبت کامنت</p>
                                    <p className="text-sm text-slate-500">کاربران می‌توانند زیر مقالات کامنت بگذارند</p>
                                </div>
                                <button type="button" onClick={() => setData('allow_comments', !data.allow_comments)}
                                    className={`relative h-8 w-14 rounded-full transition-colors ${data.allow_comments ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                    <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${data.allow_comments ? 'right-1' : 'right-7'}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Submit */}
                <div className="flex gap-3">
                    <button type="submit" disabled={processing}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 disabled:opacity-60">
                        {processing ? (
                            <>
                                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                در حال ذخیره...
                            </>
                        ) : (
                            <>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                ذخیره تنظیمات
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}