export function trackEvent(name: string, params?: Record<string, any>) {
    // GA4
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', name, params);
    }
    // Microsoft Clarity custom tags
    if (typeof window !== 'undefined' && window.clarity) {
        window.clarity('set', name, JSON.stringify(params ?? {}));
    }
}
