import ContactForm from '@/app/(public)/[locale]/properties/[slug]/ContactForm';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Contact' });
    return {
        title: `${t('title')} | LASS Realty`,
        description: t('description'),
    };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'Contact' });
    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight sm:text-5xl">{t('title')}</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Contact Info */}
                        <div className="bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-center">
                            <h3 className="text-2xl font-bold mb-6">{t('headquarters')}</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{t('addressLabel')}</p>
                                    <p className="text-lg" dangerouslySetInnerHTML={{ __html: t('addressValue') }} />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{t('emailLabel')}</p>
                                    <a href="mailto:info@lassrealty.com" className="text-lg hover:text-amber-400 transition-colors">info@lassrealty.com</a>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{t('phoneLabel')}</p>
                                    <a href="tel:+15551234567" className="text-lg hover:text-amber-400 transition-colors">+1 (555) 123-4567</a>
                                </div>
                            </div>
                        </div>

                        {/* Form Area */}
                        <div className="p-8 md:p-12">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('sendInquiry')}</h3>
                            {/* We can reuse ContactForm with an empty propertySlug to denote a general inquiry */}
                            <ContactForm propertySlug="general-inquiry" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
