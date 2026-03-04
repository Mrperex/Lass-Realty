'use client';

import { useState } from 'react';
import { Share2, Check, Link2, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ShareButtonProps {
    title: string;
    slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const t = useTranslations('PropertyDetail');

    const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://lasspuntacana.com'}/properties/${slug}`;

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch { /* user cancelled */ }
        } else {
            setShowMenu(!showMenu);
        }
    };

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => { setCopied(false); setShowMenu(false); }, 2000);
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, '_blank');
        setShowMenu(false);
    };

    const handleEmail = () => {
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this property: ${url}`)}`, '_blank');
        setShowMenu(false);
    };

    return (
        <div className="relative">
            <button
                onClick={handleNativeShare}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-colors group"
                title={t('share', { fallback: 'Share' })}
                aria-label="Share property"
            >
                <Share2 className="w-4 h-4 text-slate-500 group-hover:text-champagne-500 transition-colors" />
            </button>

            {/* Dropdown menu (for desktop browsers without native share) */}
            {showMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-12 z-50 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-52 animate-in fade-in duration-200">
                        <button
                            onClick={handleCopyLink}
                            className="w-full px-4 py-2.5 text-left text-sm font-outfit text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4 text-slate-400" />}
                            {copied ? (t('linkCopied', { fallback: 'Link Copied!' })) : (t('copyLink', { fallback: 'Copy Link' }))}
                        </button>
                        <button
                            onClick={handleWhatsApp}
                            className="w-full px-4 py-2.5 text-left text-sm font-outfit text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            WhatsApp
                        </button>
                        <button
                            onClick={handleEmail}
                            className="w-full px-4 py-2.5 text-left text-sm font-outfit text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Email
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
