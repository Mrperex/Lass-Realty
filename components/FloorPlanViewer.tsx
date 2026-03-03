'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FloorPlanViewerProps {
    floorPlans: string[];
}

export default function FloorPlanViewer({ floorPlans }: FloorPlanViewerProps) {
    const t = useTranslations('PropertyDetail');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!floorPlans || floorPlans.length === 0) return null;

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % floorPlans.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + floorPlans.length) % floorPlans.length);
    };

    return (
        <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
                <Map className="w-6 h-6 text-champagne-500" />
                <h2 className="text-2xl font-bold text-slate-900">{t('interactiveFloorPlans', { fallback: 'Interactive Floor Plans' })}</h2>
            </div>

            <div
                className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group"
                onClick={() => setIsFullscreen(true)}
            >
                <Image
                    src={floorPlans[currentIndex]}
                    alt={`Floor Plan ${currentIndex + 1}`}
                    fill
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-navy-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/90 text-navy-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <Maximize2 className="w-5 h-5" />
                        {t('viewFullscreen', { fallback: 'View Fullscreen' })}
                    </div>
                </div>

                {floorPlans.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-navy-900/80 text-white px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md">
                        {currentIndex + 1} / {floorPlans.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {floorPlans.length > 1 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    {floorPlans.map((plan, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${currentIndex === idx ? 'border-champagne-500 ring-4 ring-champagne-500/20' : 'border-slate-200 hover:border-champagne-300'
                                }`}
                        >
                            <Image src={plan} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-2" />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-navy-900/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="absolute top-4 right-4 z-50 flex gap-4">
                        <span className="bg-white/10 text-white px-4 py-2 rounded-xl font-medium backdrop-blur-md">
                            {currentIndex + 1} / {floorPlans.length}
                        </span>
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="bg-white/10 p-2 rounded-xl text-white hover:bg-white/20 hover:text-red-400 transition-colors backdrop-blur-md"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="relative w-full h-full p-4 md:p-12 flex items-center justify-center">
                        <Image
                            src={floorPlans[currentIndex]}
                            alt={`Fullscreen Floor Plan ${currentIndex + 1}`}
                            fill
                            className="object-contain p-4 md:p-12"
                            quality={100}
                        />
                    </div>

                    {floorPlans.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-4 rounded-full text-white hover:bg-white border border-white/20 hover:text-navy-900 transition-colors backdrop-blur-md z-50"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-4 rounded-full text-white hover:bg-white border border-white/20 hover:text-navy-900 transition-colors backdrop-blur-md z-50"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
