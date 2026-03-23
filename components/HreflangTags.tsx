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
    
    const hreflangTags = locales.map(locale => {
        const localePath = locale === 'en' ? '' : `/${locale}`;
        const url = `${baseUrl}${localePath}${cleanPath}`;
        
        return {
            rel: 'alternate',
            hrefLang: locale,
            href: url
        };
    });

    // Add x-default for international users
    hreflangTags.push({
        rel: 'alternate',
        hrefLang: 'x-default',
        href: `${baseUrl}${cleanPath}`
    });

    // Add self-referencing canonical
    hreflangTags.push({
        rel: 'canonical',
        hrefLang: currentLocale,
        href: `${baseUrl}${currentLocale === 'en' ? '' : `/${currentLocale}`}${cleanPath}`
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
        
        // Remove existing hreflang and canonical links
        document.querySelectorAll('link[rel="alternate"], link[rel="canonical"]').forEach(tag => tag.remove());
        
        // Add new tags
        tags.forEach(tag => {
            const link = document.createElement('link');
            link.rel = tag.rel;
            if (tag.hrefLang) link.hreflang = tag.hrefLang;
            link.href = tag.href;
            document.head.appendChild(link);
        });
        
        // Cleanup on unmount
        return () => {
            document.querySelectorAll('link[rel="alternate"], link[rel="canonical"]').forEach(tag => tag.remove());
        };
    }, [pathname, locale]);
    
    return null;
}
