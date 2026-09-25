import { useEffect, useState } from 'react';

export default function Clock() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hidden text-left sm:block">
            <p className="text-sm font-bold tabular-nums text-slate-900 dark:text-slate-900 dark:text-white" dir="ltr">
                {now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-600 dark:text-slate-400">
                {now.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
        </div>
    );
}