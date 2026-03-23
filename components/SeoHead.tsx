import Head from 'next/head';
import { usePathname } from 'next/navigation';
import HreflangTags from './HreflangTags';

interface SeoHeadProps {
    title: string;
    description: string;
    locale: string;
    image?: string;
    type?: string;
}

export default function SeoHead({ 
    title, 
    description, 
    locale, 
    image = "https://lasspuntacana.com/images/og-default.jpg",
    type = "website"
}: SeoHeadProps) {
    const pathname = usePathname();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lasspuntacana.com';
    const cleanPath = pathname.replace(/^\/(en|es|fr|it|ru|de|ht)/, '');
    const fullUrl = `${baseUrl}${locale === 'en' ? '' : `/${locale}`}${cleanPath}`;
    
    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            
            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />
            
            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content={locale === 'es' ? 'es_ES' : locale === 'fr' ? 'fr_FR' : locale === 'it' ? 'it_IT' : locale === 'de' ? 'de_DE' : locale === 'ru' ? 'ru_RU' : locale === 'ht' ? 'ht_HT' : 'en_US'} />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            
            {/* Hreflang Tags */}
            <HreflangTags locale={locale} />
            
            {/* Additional SEO Tags */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <meta name="author" content="LASS Realty" />
            <meta name="language" content={locale} />
            
            {/* Preconnect to external domains */}
            <link rel="preconnect" href="https://res.cloudinary.com" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            
            {/* DNS Prefetch */}
            <link rel="dns-prefetch" href="//www.google-analytics.com" />
            <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        </Head>
    );
}
