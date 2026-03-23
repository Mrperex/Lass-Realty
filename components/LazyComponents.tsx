'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading skeleton for components
const ComponentLoader = () => (
    <div className="animate-pulse">
        <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
    </div>
);

// Dynamically import non-critical components with loading states
export const DynamicExitIntentPopup = dynamic(
    () => import('./ExitIntentPopup'),
    { 
        loading: ComponentLoader,
        ssr: false 
    }
);

export const DynamicCookieConsent = dynamic(
    () => import('./CookieConsent'),
    { 
        loading: ComponentLoader,
        ssr: false 
    }
);

export const DynamicCompareDock = dynamic(
    () => import('./CompareDock'),
    { 
        loading: ComponentLoader,
        ssr: false 
    }
);

export const DynamicMobileBottomNav = dynamic(
    () => import('./MobileBottomNav'),
    { 
        loading: ComponentLoader,
        ssr: false 
    }
);

export const DynamicWhatsAppButton = dynamic(
    () => import('./WhatsAppButton'),
    { 
        loading: ComponentLoader,
        ssr: false 
    }
);

export const DynamicScrollToTopButton = dynamic(
    () => import('./ScrollToTopButton'),
    { 
        loading: ComponentLoader,
        ssr: false 
    }
);

// Wrapper component that lazy loads all non-critical UI elements
export default function LazyNonCriticalComponents() {
    return (
        <Suspense fallback={null}>
            <DynamicExitIntentPopup />
            <DynamicCookieConsent />
            <DynamicCompareDock />
            <DynamicMobileBottomNav />
            <DynamicWhatsAppButton />
            <DynamicScrollToTopButton />
        </Suspense>
    );
}
