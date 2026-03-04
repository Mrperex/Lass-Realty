'use client';

import Script from 'next/script';

/**
 * Plausible Analytics — GDPR-compliant, cookieless analytics
 * 
 * - No cookies, no personal data collected
 * - Fully GDPR, CCPA, and PECR compliant out of the box
 * - Lightweight (~1KB script)
 * 
 * Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN in env to enable.
 * Sign up at https://plausible.io and add your domain.
 */
export default function PlausibleAnalytics() {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!domain) return null;

    return (
        <Script
            defer
            data-domain={domain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
        />
    );
}
