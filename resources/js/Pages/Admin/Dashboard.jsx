import { router } from '@inertiajs/react';
import ThreeBackground from '@/Components/ThreeBackground';

export default function Dashboard({ user, roles }) {
    const logout = () => router.post('/logout');

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
            <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950" aria-hidden="true" />
            <ThreeBackground density={0.7} />

            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.06] p-10 text-center shadow-2xl shadow-blue-950/60 backdrop-blur-2xl">
                <p className="text-sm text-cyan-300">خوش اومدی،</p>
                <h1 className="mt-2 text-3xl font-black text-white">{user.name}</h1>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {roles.map((role) => (
                        <span key={role} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                            {role}
                        </span>
                    ))}
                </div>

                <p className="mt-6 text-slate-400">پنل مدیریت اصلی به‌زودی اینجا ساخته میشه... 🏗️</p>

                <button
                    onClick={logout}
                    className="mt-8 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-slate-200 transition-all duration-300 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
                >
                    خروج از حساب
                </button>
            </div>
        </div>
    );
}