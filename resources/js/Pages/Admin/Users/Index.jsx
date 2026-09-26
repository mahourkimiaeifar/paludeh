import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ users }) {
    const { flash } = usePage().props;

    const deleteUser = (id) => {
        if (confirm('آیا مطمئنی؟ این کاربر برای همیشه حذف میشه!')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const getRoleBadge = (roles) => {
        const role = roles[0] || 'user';
        const styles = {
            super_admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
            content_manager: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
            support: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
            user: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
        };
        return <span className={`rounded-full px-3 py-1 text-xs ${styles[role] || styles.user}`}>{role}</span>;
    };

    return (
        <AdminLayout title="مدیریت کاربران">
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
                <p className="text-sm text-slate-600 dark:text-slate-400">{users.length} کاربر</p>
                <Link
                    href="/admin/users/create"
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110"
                >
                    <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    کاربر جدید
                </Link>
            </div>

            {users.length === 0 ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-12 dark:border-white/10">
                    <p className="text-xl text-slate-600 dark:text-slate-400">هنوز کاربری ثبت نشده!</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">نام</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">ایمیل</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">نقش</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">وضعیت</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">تاریخ</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 dark:text-slate-300">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {users.map((user, i) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400" dir="ltr">{user.email}</td>
                                    <td className="px-6 py-4">{getRoleBadge(user.roles)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs ${user.is_active ? 'bg-green-500/10 text-green-600 dark:text-green-300' : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'}`}>
                                            {user.is_active ? 'فعال' : 'غیرفعال'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.created_at}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/users/${user.id}/edit`} className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-500/20 dark:text-blue-300">
                                                ویرایش
                                            </Link>
                                            <button onClick={() => deleteUser(user.id)} className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-500/20 dark:text-rose-300">
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