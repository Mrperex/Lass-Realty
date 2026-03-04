'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SavedPropertiesSlider from './SavedPropertiesSlider';
import CurrencySelector from './CurrencySelector';
import RecentlyViewedSlider from './RecentlyViewedSlider';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Navigation');

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm relative font-outfit">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-playfair font-bold tracking-tighter text-navy-900 flex items-center gap-2">
                            LASS <span className="font-outfit font-light text-champagne-500 uppercase tracking-[0.2em] text-sm mt-1">Realty</span>
                        </Link>
                    </div>
                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-slate-600 hover:text-champagne-500 font-bold uppercase tracking-widest text-xs transition-colors">{t('home')}</Link>
                        <Link href="/properties" className="text-slate-600 hover:text-champagne-500 font-bold uppercase tracking-widest text-xs transition-colors">{t('properties')}</Link>
                        <Link href="/blog" className="text-slate-600 hover:text-champagne-500 font-bold uppercase tracking-widest text-xs transition-colors">{t('blog')}</Link>
                        <Link href="/neighborhoods" className="text-slate-600 hover:text-champagne-500 font-bold uppercase tracking-widest text-xs transition-colors">{t('neighborhoods')}</Link>
                        <Link href="/buying-guide" className="text-slate-600 hover:text-champagne-500 font-bold uppercase tracking-widest text-xs transition-colors">{t('buyingGuide')}</Link>
                        <Link href="/about" className="text-slate-600 hover:text-champagne-500 font-bold uppercase tracking-widest text-xs transition-colors">{t('about')}</Link>
                        <Link href="/contact" className="text-slate-600 hover:text-champagne-500 font-bold uppercase tracking-widest text-xs transition-colors">{t('contact')}</Link>
                    </nav>

                    <div className="flex items-center gap-2 md:gap-6">
                        {/* Global Settings & Toggles */}
                        <LanguageSwitcher />
                        <CurrencySelector />
                        <RecentlyViewedSlider />
                        <SavedPropertiesSlider />

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-navy-900 hover:text-champagne-500 focus:outline-none p-2 transition-colors" aria-label="Toggle menu">
                                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-t border-slate-100 py-6 flex flex-col px-8 gap-6 z-50">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">{t('home')}</Link>
                    <Link href="/properties" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">{t('properties')}</Link>
                    <Link href="/blog" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">{t('blog')}</Link>
                    <Link href="/neighborhoods" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">{t('neighborhoods')}</Link>
                    <Link href="/buying-guide" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">{t('buyingGuide')}</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">{t('about')}</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">{t('contact')}</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
