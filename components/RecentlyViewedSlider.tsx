'use client';

import { useRecentStore } from '@/store/recentStore';
import { History, X, ChevronRight, Bed, Bath } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { formatCurrency } from '@/lib/utils';

export default function RecentlyViewedSlider() {
    const { recentProperties, clearRecent } = useRecentStore();
    const [isOpen, setIsOpen] = useState(false);

    // Handle hydration
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <button className="relative p-2 text-slate-600 hover:text-champagne-500 transition-colors">
                <History className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="relative font-outfit">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 hover:text-champagne-500 transition-colors flex items-center gap-2 group"
                aria-label="View history"
            >
                <History className="w-6 h-6 transition-colors" />
            </button>

            {/* Slide-over Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-over Panel */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-slate-100`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-playfair text-2xl font-bold text-navy-900 flex items-center gap-3">
                        <History className="w-6 h-6 text-champagne-500" />
                        Recently Viewed
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {recentProperties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                <History className="w-8 h-8 text-slate-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No viewing history</h3>
                                <p className="text-slate-500 text-sm">Properties you view will appear here so you don&apos;t lose track of them.</p>
                            </div>
                            <Link
                                href="/properties"
                                onClick={() => setIsOpen(false)}
                                className="mt-4 px-6 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-champagne-500 hover:text-navy-900 transition-colors uppercase tracking-widest text-xs"
                            >
                                Browse Properties
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-end">
                                <button
                                    onClick={clearRecent}
                                    className="text-xs font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
                                >
                                    Clear History
                                </button>
                            </div>

                            {recentProperties.map((property) => (
                                <div key={property.slug} className="group bg-white border border-slate-100 rounded-2xl p-3 flex gap-4 relative shadow-sm hover:shadow-md transition-shadow">
                                    <Link href={`/properties/${property.slug}`} onClick={() => setIsOpen(false)} className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
                                        {property.images && property.images.length > 0 ? (
                                            <Image
                                                src={property.images[0]}
                                                alt={property.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">No Image</div>
                                        )}
                                    </Link>

                                    <div className="flex-1 flex flex-col justify-between py-1 pr-2">
                                        <Link href={`/properties/${property.slug}`} onClick={() => setIsOpen(false)}>
                                            <h4 className="font-playfair text-base font-bold text-navy-900 line-clamp-2 leading-tight group-hover:text-champagne-600 transition-colors mb-1">
                                                {property.title}
                                            </h4>
                                            <div className="text-sm font-bold text-champagne-500">
                                                {formatCurrency(property.price)}
                                            </div>
                                        </Link>

                                        <div className="flex gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" />{property.bedrooms}</span>
                                            <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" />{property.bathrooms}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {recentProperties.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                        <Link
                            href="/properties"
                            onClick={() => setIsOpen(false)}
                            className="w-full h-[52px] bg-navy-900 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-navy-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            Continue Browsing
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
