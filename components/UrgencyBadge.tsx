'use client';

import { useEffect, useState } from 'react';
import { Flame, Eye, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UrgencyBadge({ slug }: { slug: string }) {
    const t = useTranslations('PropertyCard');
    const [mounted, setMounted] = useState(false);
    const [urgencyData, setUrgencyData] = useState<{ type: 'hot' | 'viewers' | 'rare' | null, value?: number }>({ type: null });

    useEffect(() => {
        setMounted(true);

        // Deterministic pseudo-random generation based on slug length and char codes
        // to prevent hydration mismatches while appearing dynamic
        const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        // 30% chance for "Hot Property", 40% chance for "Active Viewers", 30% for "Rare Find"
        const typeSelector = hash % 10;

        if (typeSelector < 3) {
            setUrgencyData({ type: 'hot' });
        } else if (typeSelector < 7) {
            // Viewers between 3 and 14
            const viewers = 3 + (hash % 12);
            setUrgencyData({ type: 'viewers', value: viewers });
        } else {
            setUrgencyData({ type: 'rare' });
        }
    }, [slug]);

    if (!mounted || !urgencyData.type) return null;

    if (urgencyData.type === 'hot') {
        return (
            <div className="absolute top-4 left-4 z-20 bg-rose-500 text-white px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-white/20 animate-in fade-in duration-500 font-outfit">
                <Flame className="w-3.5 h-3.5 fill-white" />
                {t('hotProperty', { fallback: 'Hot Property' })}
            </div>
        );
    }

    if (urgencyData.type === 'viewers') {
        return (
            <div className="absolute top-4 left-4 z-20 bg-navy-900/90 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-white/20 animate-in fade-in duration-500 font-outfit">
                <Eye className="w-4 h-4 text-champagne-500" />
                {t('viewingRightNow', { count: urgencyData.value || 3, fallback: `${urgencyData.value} viewing now` })}
            </div>
        );
    }

    if (urgencyData.type === 'rare') {
        return (
            <div className="absolute top-4 left-4 z-20 bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-white/20 animate-in fade-in duration-500 font-outfit">
                <Clock className="w-3.5 h-3.5" />
                {t('rareFind', { fallback: 'Rare Find' })}
            </div>
        );
    }

    return null;
}
