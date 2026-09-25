import AdminLayout, { Icon } from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-slate-900 transition-all focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-900 dark:text-white dark:focus:border-cyan-400/60 dark:focus:ring-cyan-400/25';
const labelClass = 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-700 dark:text-slate-300';
const errorClass = 'mt-1.5 text-xs text-rose-500 dark:text-rose-300';

export default function Edit({ user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role || 'content_manager',
        is_active: Boolean(user.is_active),
    });
    const [confirming, setConfirming] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout title="ویرایش کاربر">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={submit}
                className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-200 dark:border-white/10 dark:bg-white/70 dark:bg-white/[0.06] dark:shadow-none"
            >
                <div>
                    <label htmlFor="name" className={labelClass}>نام</label>
                    <input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>ایمیل</label>
                    <input id="email" type="email" dir="ltr" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
                    {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="role" className={labelClass}>نقش</label>
                    <select id="role" value={data.role} onChange={(e) => setData('role', e.target.value)} className={inputClass}>
                        {roles.map((role) => (
                            <option key={role} value={role} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-900 dark:text-white">{role}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/50 px-4 py-3 dark:border-slate-200 dark:border-white/10 dark:bg-white/[0.03]">
                    <span className={labelClass + ' mb-0'}>حساب فعال باشد</span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={data.is_active}
                        onClick={() => setData('is_active', !data.is_active)}
                        className={`relative h-7 w-12 rounded-full transition-colors ${data.is_active ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${data.is_active ? 'right-1' : 'right-6'}`} />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button type="submit" disabled={processing} className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-slate-900 dark:text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
                        {processing ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <Link href="/admin/users" className="rounded-xl border border-slate-200 bg-white/60 px-6 py-3 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-700 dark:text-slate-300 dark:hover:bg-white/10">
                        انصراف
                    </Link>
                </div>

                <div className="border-t border-slate-200 pt-4 dark:border-slate-200 dark:border-white/10">
                    {confirming ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-rose-500 dark:text-rose-300">مطمئنی؟ این کاربر برای همیشه حذف میشه!</span>
                            <button type="button" onClick={() => router.delete(`/admin/users/${user.id}`)} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-slate-900 dark:text-white hover:bg-rose-600">
                                بله، حذف کن
                            </button>
                            <button type="button" onClick={() => setConfirming(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-200 dark:border-white/10 dark:text-slate-700 dark:text-slate-300">
                                انصراف
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setConfirming(true)} className="rounded-xl border border-rose-300/50 bg-rose-500/10 px-4 py-2 text-sm text-rose-500 transition-all hover:bg-rose-500/20 dark:border-rose-400/30 dark:text-rose-300">
                            حذف این کاربر
                        </button>
                    )}
                </div>
            </motion.form>
        </AdminLayout>
    );
}