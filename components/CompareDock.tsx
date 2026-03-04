'use client';

import { useCompareStore } from '@/store/compareStore';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { X, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from '@/navigation';
import DynamicPrice from './DynamicPrice';
import { useEffect, useState } from 'react';

export default function CompareDock() {
    const { compareList, removeCompare, isDockOpen, closeDock, openDock } = useCompareStore();
    const t = useTranslations('CompareDock');

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || compareList.length === 0) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-500 ease-in-out ${isDockOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'
                }`}
        >
            {/* Toggle Handle / Header */}
            <div
                className="bg-navy-900 border-t border-navy-800 shadow-2xl rounded-t-3xl max-w-5xl mx-auto flex flex-col items-center"
            >
                <button
                    onClick={isDockOpen ? closeDock : openDock}
                    className="w-full flex items-center justify-center py-3 text-slate-300 hover:text-white transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                        <Scale className="w-4 h-4" />
                        {t('compareTitle', { fallback: 'Compare Properties' })} ({compareList.length}/3)
                        {isDockOpen ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronUp className="w-4 h-4 ml-2" />}
                    </div>
                </button>

                {/* Main Dock Content */}
                <div className="w-full bg-white text-navy-900 overflow-hidden rounded-tr-xl flex flex-col md:flex-row px-4 md:px-8 py-6 gap-6 items-center border-[0.5px] border-slate-200 shadow-inner">

                    {/* Selected Properties Preview */}
                    <div className="flex-1 flex w-full md:w-auto items-center justify-center md:justify-start gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {compareList.map((property) => (
                            <div key={property._id as string} className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                                <Image
                                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400'}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 right-2 flex flex-col">
                                    <span className="text-[10px] md:text-xs text-white font-semibold truncate leading-tight shadow-sm">{property.title}</span>
                                    <span className="text-[9px] md:text-[10px] text-champagne-400 font-bold truncate"><DynamicPrice price={property.price} /></span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeCompare(property._id as string);
                                    }}
                                    className="absolute top-1 right-1 bg-white/90 text-slate-800 rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 shadow-sm"
                                    aria-label="Remove from compare"
                                >
                                    <X className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                            </div>
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                                <span className="text-2xl font-light">+</span>
                                <span className="text-[10px] md:text-xs font-semibold mt-1">Add to Compare</span>
                            </div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
                        <Link
                            href="/compare"
                            onClick={closeDock} // Close it so it's not in the way on the compare page
                            className={`px-8 py-4 rounded-xl font-bold text-center transition-all duration-300 ${compareList.length >= 2
                                    ? 'bg-champagne-500 text-navy-900 hover:bg-champagne-400 hover:shadow-lg hover:-translate-y-1'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                }`}
                            aria-disabled={compareList.length < 2}
                        >
                            {t('compareNow', { fallback: 'Compare Now' })}
                        </Link>
                        {compareList.length < 2 && (
                            <span className="text-[11px] text-slate-500 text-center font-medium">Select {2 - compareList.length} more to compare</span>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
