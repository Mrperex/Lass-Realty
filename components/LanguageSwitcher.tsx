'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useTransition, useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGE_MAP: Record<string, { label: string; full: string }> = {
    en: { label: 'EN', full: 'English' },
    es: { label: 'ES', full: 'Español' },
    fr: { label: 'FR', full: 'Français' },
    it: { label: 'IT', full: 'Italiano' },
    de: { label: 'DE', full: 'Deutsch' },
    ru: { label: 'RU', full: 'Русский' },
    ht: { label: 'HT', full: 'Kreyòl' }
};

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const switchLocale = (nextLocale: string) => {
        if (nextLocale === locale) {
            setIsOpen(false);
            return;
        }

        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
            setIsOpen(false);
        });
    };

    return (
        <div className="relative font-outfit z-[100]" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-200/80 backdrop-blur-md px-3 md:px-4 py-2 rounded-xl transition-all duration-300 border border-slate-200 group relative shadow-sm"
                aria-label="Select Language"
            >
                <Globe className="w-4 h-4 text-slate-500 group-hover:text-champagne-500 transition-colors" />
                <span className="font-bold text-xs tracking-wider text-navy-900 group-hover:text-champagne-600 transition-colors uppercase">
                    {LANGUAGE_MAP[locale]?.label || locale}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />

                {/* Loader Overlay */}
                {isPending && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-champagne-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {Object.entries(LANGUAGE_MAP).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => switchLocale(key)}
                            className="w-full flex items-center justify-between px-5 py-3 text-sm text-left transition-colors hover:bg-slate-50 group"
                        >
                            <span className={`font-medium ${locale === key ? 'text-champagne-600 font-bold' : 'text-slate-600 group-hover:text-navy-900'}`}>
                                {data.full}
                            </span>
                            {locale === key && (
                                <Check className="w-4 h-4 text-champagne-500" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
