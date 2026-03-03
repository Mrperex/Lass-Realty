import Image from 'next/image';
import { ShieldCheck, Award, MapPin, CheckCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import WhatsAppButton from '@/components/WhatsAppButton';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: `${t('title')} | LASS Realty`,
        description: t('description'),
    };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'About' });
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 bg-slate-900/60 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09be1587?auto=format&fit=crop&q=80"
                    alt="Luxury Dominican Republic Real Estate"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-slate-200 max-w-2xl mx-auto font-light drop-shadow">
                        {t('description')}
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">{t('authorityTitle')}</h2>
                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
                            <p>{t('p1')}</p>
                            <p>{t('p2')}</p>
                            <p>{t('p3')}</p>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-amber-100 p-2 rounded-lg"><ShieldCheck className="w-6 h-6 text-amber-600" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{t('legalSecurity')}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{t('legalSecurityDesc')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-amber-100 p-2 rounded-lg"><MapPin className="w-6 h-6 text-amber-600" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{t('marketInsight')}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{t('marketInsightDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
                                alt="Real Estate Professional"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block">
                            <div className="flex items-center gap-4 mb-4">
                                <Award className="w-10 h-10 text-amber-500" />
                                <div>
                                    <div className="text-3xl font-bold text-slate-900">$100M+</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{t('turnover')}</div>
                                </div>
                            </div>
                            <div className="text-slate-600 font-medium border-t border-slate-100 pt-4" dangerouslySetInnerHTML={{ __html: t('recognized') }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">{t('whyTrustTitle')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="bg-slate-50 p-8 rounded-2xl">
                            <CheckCircle className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="font-bold text-slate-900 text-lg mb-2">{t('vettedTitle')}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{t('vettedDesc')}</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl">
                            <CheckCircle className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="font-bold text-slate-900 text-lg mb-2">{t('endToEndTitle')}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{t('endToEndDesc')}</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl">
                            <CheckCircle className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="font-bold text-slate-900 text-lg mb-2">{t('expertsTitle')}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{t('expertsDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
