'use client';

import { useEffect, useState } from 'react';

export default function LogoReveal() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Only show the reveal once per browser session
        if (sessionStorage.getItem('logo_revealed')) {
            setIsVisible(false);
            return;
        }

        // Keep it completely visible for 800ms, then start the 700ms crossfade
        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 800);

        // Completely unmount from DOM after 1500ms max
        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('logo_revealed', 'true');
        }, 1500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-navy-900 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-1000 ease-out">
                <div className="text-5xl md:text-7xl font-playfair font-bold text-champagne-400 tracking-tighter drop-shadow-2xl">
                    LASS
                </div>
                <div className="text-xl md:text-3xl font-outfit font-light text-offwhite uppercase tracking-[0.3em] mt-3">
                    Realty
                </div>
            </div>

            {/* Subtle loading pulse beneath the logo */}
            <div className="absolute bottom-1/3 w-32 h-px bg-gradient-to-r from-transparent via-champagne-500/50 to-transparent animate-pulse" />
        </div>
    );
}
