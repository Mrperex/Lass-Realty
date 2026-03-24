'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LogoReveal() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Only show the reveal once per browser session
        if (sessionStorage.getItem('logo_revealed')) {
            setIsVisible(false);
            return;
        }

        // Keep it completely visible for 500ms (reduced from 800ms), then start the 500ms crossfade (reduced from 700ms)
        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 500);

        // Completely unmount from DOM after 1000ms max (reduced from 1500ms)
        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('logo_revealed', 'true');
        }, 1000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-navy-900 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700 ease-out">
                <Image 
                    src="/images/logos/lass-realty-logo-Master.svg" 
                    alt="LASS Realty"
                    width={320}
                    height={160}
                    className="w-64 md:w-80 h-auto"
                    unoptimized
                />
            </div>

            {/* Subtle loading pulse beneath the logo */}
            <div className="absolute bottom-1/3 w-32 h-px bg-gradient-to-r from-transparent via-champagne-500/50 to-transparent animate-pulse" />
        </div>
    );
}
