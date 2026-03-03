import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

const Footer = () => {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">{t('title')}</h3>
                        <p className="text-sm">
                            {t('description')}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-semibold mb-4">{t('quickLinks')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">{t('aboutUs')}</Link></li>
                            <li><Link href="/properties" className="hover:text-white transition-colors">{t('properties')}</Link></li>
                            <li><Link href="/buying-guide" className="hover:text-white transition-colors">{t('buyingGuide')}</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-semibold mb-4">{t('legal')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-semibold mb-4">{t('contactUs')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>info@lassrealty.com</li>
                            <li>+1 (829) 523-0782</li>
                        </ul>
                    </div>
                </div>

                {/* Regulatory & Licensing */}
                <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400/80 flex flex-col items-center text-center space-y-2 max-w-4xl mx-auto">
                    <p>
                        LASS Realty is a registered real estate brokerage in the Dominican Republic (Registration No. R-789-V2).
                        Member of the National Association of Real Estate Professionals (License No. 442-991A).
                    </p>
                    <p>
                        All information provided is deemed reliable but is not guaranteed and should be independently verified.
                        Properties are subject to prior sale, change, or withdrawal. Neither listing broker(s) nor LASS Realty shall be responsible for any typographical errors, misinformation, or misprints.
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/50 text-sm text-center text-slate-500">
                    &copy; {new Date().getFullYear()} {t('title')}. {t('rights')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
