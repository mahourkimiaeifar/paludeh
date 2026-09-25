import AdminLayout from '@/Layouts/AdminLayout';
import { Icon } from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';

const cards = [
    { key: 'users', label: 'کل کاربران', icon: 'users' },
    { key: 'verified', label: 'تایید شده', icon: 'assets' },
    { key: 'admins', label: 'مدیران', icon: 'settings' },
    { key: 'newThisWeek', label: 'جدید این هفته', icon: 'articles' },
];

export default function Dashboard({ stats, recentUsers }) {
    return (
        <AdminLayout title="داشبورد">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.09]"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">{card.label}</p>
                                <p className="mt-2 text-3xl font-black text-white">{stats[card.key]}</p>
                            </div>
                            <div className="rounded-xl bg-cyan-500/15 p-3 text-cyan-300">
                                <Icon name={card.icon} className="h-6 w-6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
            >
                <h2 className="mb-4 text-lg font-bold text-white">آخرین کاربران</h2>
                <div className="space-y-3">
                    {recentUsers.map((u) => (
                        <div key={u.email} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                            <div>
                                <p className="text-sm font-bold text-white">{u.name}</p>
                                <p className="text-xs text-slate-500" dir="ltr">{u.email}</p>
                            </div>
                            <span className="text-xs text-slate-400">{u.created_at}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </AdminLayout>
    );
}