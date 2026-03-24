'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface HreflangTag {
    rel: string;
    hrefLang: string;
    href: string;
}

export function generateHreflangTags(pathname: string, currentLocale: string): HreflangTag[] {
    const locales = ['en', 'es', 'fr', 'it', 'ru', 'de', 'ht'];
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lasspuntacana.com';
    
    // Remove locale from pathname if present
    const cleanPath = pathname.replace(/^\/(en|es|fr|it|ru|de|ht)/, '');
    
    // Every locale gets its own /locale prefix — including English
    const hreflangTags = locales.map(locale => ({
        rel: 'alternate',
        hrefLang: locale,
        href: `${baseUrl}/${locale}${cleanPath}`
    }));

    // x-default points to the English version
    hreflangTags.push({
        rel: 'alternate',
        hrefLang: 'x-default',
        href: `${baseUrl}/en${cleanPath}`
    });

    return hreflangTags;
}

interface HreflangTagsProps {
    locale: string;
}

export default function HreflangTags({ locale }: HreflangTagsProps) {
    const pathname = usePathname();
    
    useEffect(() => {
        const tags = generateHreflangTags(pathname, locale);
        
        // Remove existing hreflang links only (don't touch canonical — let Next.js metadata handle it)
        document.querySelectorAll('link[hreflang]').forEach(tag => tag.remove());
        
        // Add hreflang alternate tags
        tags.forEach(tag => {
            const link = document.createElement('link');
            link.rel = tag.rel;
            if (tag.hrefLang) link.hreflang = tag.hrefLang;
            link.href = tag.href;
            document.head.appendChild(link);
        });
        
        return () => {
            document.querySelectorAll('link[hreflang]').forEach(tag => tag.remove());
        };
    }, [pathname, locale]);
    
    return null;
}
