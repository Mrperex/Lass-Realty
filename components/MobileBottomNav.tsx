'use client';

import { Link, usePathname } from '@/navigation';
import { Home, Search, Heart, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useEffect, useState } from 'react';

export default function MobileBottomNav() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const { favorites } = useFavoritesStore();
    const [savedCount, setSavedCount] = useState(0);

    // Hydration mismatch prevention for the badge
    useEffect(() => {
        setSavedCount(favorites.length);
    }, [favorites]);

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    const openFavorites = (e: React.MouseEvent) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-favorites'));
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40 px-2 pb-safe pt-2">
            <div className="flex items-center justify-around h-16">
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${pathname === '/' || pathname === '/es' ? 'text-champagne-500' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <Home className="w-6 h-6" strokeWidth={pathname === '/' || pathname === '/es' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('home', { fallback: 'Home' })}</span>
                </Link>

                <Link
                    href="/properties"
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/properties') ? 'text-champagne-500' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <Search className="w-6 h-6" strokeWidth={isActive('/properties') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('properties', { fallback: 'Search' })}</span>
                </Link>

                <button
                    onClick={openFavorites}
                    className="relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-slate-400 hover:text-slate-600"
                >
                    <div className="relative">
                        <Heart className="w-6 h-6" strokeWidth={2} />
                        {savedCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                                {savedCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Saved</span>
                </button>

                <Link
                    href="/contact"
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/contact') ? 'text-champagne-500' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <MessageCircle className="w-6 h-6" strokeWidth={isActive('/contact') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('contact', { fallback: 'Contact' })}</span>
                </Link>
            </div>
        </div>
    );
}
