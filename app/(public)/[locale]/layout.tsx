import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import '../../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import LogoReveal from '@/components/LogoReveal';
import CookieConsent from '@/components/CookieConsent';
import CompareDock from '@/components/CompareDock';
import CustomCursor from '@/components/CustomCursor';
import MobileBottomNav from '@/components/MobileBottomNav';
import { GoogleAnalytics } from '@next/third-parties/google';
import MicrosoftClarity from '@/components/MicrosoftClarity';
import MetaPixel from '@/components/MetaPixel';
import PlausibleAnalytics from '@/components/PlausibleAnalytics';

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-cormorant'
});
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    metadataBase: new URL(process.env.SITE_URL || 'https://lasspuntacana.com'),
    title: {
        default: 'LASS Realty | Luxury Real Estate Punta Cana',
        template: '%s | LASS Realty Luxury'
    },
    description: 'Discover extraordinary luxury real estate properties, beachfront villas, and premium condos in Punta Cana, Cap Cana, and the Dominican Republic.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://lasspuntacana.com',
        siteName: 'LASS Realty',
        title: 'LASS Realty | Luxury Real Estate Punta Cana',
        description: 'Discover extraordinary luxury real estate properties, beachfront villas, and premium condos in Punta Cana, Cap Cana, and the Dominican Republic.',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1613490900233-a3d82db45e8e?auto=format&fit=crop&w=1200&h=630&q=80',
                width: 1200,
                height: 630,
                alt: 'LASS Realty Luxury Portfolio',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LASS Realty | Luxury Real Estate Punta Cana',
        description: 'Discover extraordinary luxury real estate properties in the Dominican Republic.',
        images: ['https://images.unsplash.com/photo-1613490900233-a3d82db45e8e?auto=format&fit=crop&w=1200&h=630&q=80'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'UV_If9IeT1_f1wGw3TcD2xw3JcMxVNUseVf2q2mdNE8',
    },
    manifest: '/manifest.json',
};

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages();

    return (
        <html lang={locale} className={`${cormorant.variable} ${outfit.variable}`}>
            <body className={`font-outfit flex flex-col min-h-screen bg-navy-900 text-offwhite relative`}>
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-champagne-500 text-navy-900 z-[9999] px-4 py-2 rounded-xl font-bold">
                    Skip to content
                </a>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <CustomCursor />
                    <LogoReveal />
                    <Navbar />
                    <main id="main-content" className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                    <WhatsAppButton />
                    <ScrollToTopButton />
                    <ExitIntentPopup />
                    <CookieConsent />
                    <CompareDock />
                    <MobileBottomNav />
                    {process.env.NEXT_PUBLIC_GA_ID && (
                        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                    )}
                    <MicrosoftClarity />
                    <MetaPixel />
                    <PlausibleAnalytics />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
