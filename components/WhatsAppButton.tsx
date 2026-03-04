'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function WhatsAppButton() {
    const t = useTranslations('GlobalUI');
    const pathname = usePathname();
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, [pathname]);

    const phoneNumber = "18295230782";

    let baseMessage = t('whatsappMessage');
    if (currentUrl && currentUrl.includes('/properties/')) {
        baseMessage = `${baseMessage} ${currentUrl}`;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-5 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
            aria-label={t('whatsappAria')}
        >
            <MessageCircle className="w-8 h-8" />

            {/* Tooltip */}
            <span className="absolute right-full mr-4 bg-slate-900 text-white text-sm px-4 py-2 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-lg">
                {t('whatsappTooltip')}
                <span className="absolute top-1/2 -right-1 w-2 h-2 bg-slate-900 rotate-45 transform -translate-y-1/2"></span>
            </span>

            {/* Ping animation effect */}
            <span className="absolute inline-flex w-full h-full rounded-full bg-[#25D366] opacity-30 animate-ping -z-10"></span>
        </a>
    );
}
