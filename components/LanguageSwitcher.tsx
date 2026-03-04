'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const switchLocale = () => {
        const nextLocale = locale === 'en' ? 'es' : 'en';
        startTransition(() => {
            // Replaces the current URL keeping the exact path logic but swapping the locale chunk
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/60">
            <button
                onClick={() => locale !== 'en' && switchLocale()}
                disabled={isPending || locale === 'en'}
                className={`px-3 py-1.5 rounded-lg font-outfit font-bold text-xs tracking-wider transition-all duration-300 ${locale === 'en'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                aria-label="Switch to English"
            >
                EN
            </button>
            <button
                onClick={() => locale !== 'es' && switchLocale()}
                disabled={isPending || locale === 'es'}
                className={`px-3 py-1.5 rounded-lg font-outfit font-bold text-xs tracking-wider transition-all duration-300 ${locale === 'es'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                aria-label="Switch to Spanish"
            >
                ES
            </button>
        </div>
    );
}
