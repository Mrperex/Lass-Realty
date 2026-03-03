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
        <button
            onClick={switchLocale}
            disabled={isPending}
            className="flex items-center gap-1.5 p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-champagne-500 transition-colors disabled:opacity-50"
            aria-label="Switch Language"
        >
            <Globe className="w-5 h-5" />
            <span className="font-outfit font-bold text-xs uppercase tracking-wider hidden sm:inline-block pt-0.5">
                {locale === 'en' ? 'EN' : 'ES'}
            </span>
        </button>
    );
}
