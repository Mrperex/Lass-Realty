'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/navigation';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Mount check ensures no hydration errors with localStorage
        const consent = localStorage.getItem('lass_cookie_consent');
        if (!consent) {
            // Slight delay so it doesn't jarringly block the logo reveal animation
            const timer = setTimeout(() => setIsVisible(true), 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('lass_cookie_consent', 'accepted');

        // Trigger generic GTM or GA event mapping if strictly needed later
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted',
                'personalization_storage': 'granted'
            });
        }

        setIsVisible(false);
    };

    const handleEssentialOnly = () => {
        localStorage.setItem('lass_cookie_consent', 'essential');

        // Deny non-essential tracking via Google Tag Manager logic
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'personalization_storage': 'denied'
            });
        }

        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-[9990] pointer-events-none font-outfit">
            <div className="max-w-7xl mx-auto flex justify-end">
                {/* 
                    Using fixed width & glassmorphism floating card instead of entire bottom bar 
                    to maintain premium, non-intrusive aesthetic.
                */}
                <div className="bg-navy-900/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out">

                    <div className="flex flex-col gap-5">
                        <div className="flex items-start justify-between">
                            <h3 className="font-cormorant text-xl font-bold text-white tracking-wide">
                                Your Privacy
                            </h3>
                        </div>

                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                            LASS Realty uses cookies to enhance your browsing experience, serve personalized luxury estates, and analyze our global traffic. By clicking "Accept All", you consent to our use of tracking technologies in accordance with our{' '}
                            <Link href="/privacy" className="text-champagne-400 hover:text-champagne-300 underline underline-offset-4 font-semibold transition-colors">
                                Privacy Policy
                            </Link>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <button
                                onClick={handleEssentialOnly}
                                className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 text-sm font-bold tracking-wider uppercase transition-colors sm:w-1/2"
                            >
                                Essential Only
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="px-6 py-3 rounded-xl bg-champagne-500 text-navy-900 hover:bg-champagne-400 text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all sm:w-1/2"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
