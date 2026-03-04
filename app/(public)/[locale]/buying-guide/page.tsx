import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import FAQAccordion from '@/components/FAQAccordion';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, FileText, Landmark, Handshake, MapPin } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'BuyingGuide' });
    return {
        title: `${t('title')} | LASS Realty`,
        description: t('subtitle')
    };
}

export default async function BuyingGuidePage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'BuyingGuide' });

    const faqs = [
        { question: t('faq1Q'), answer: t('faq1A') },
        { question: t('faq2Q'), answer: t('faq2A') },
        { question: t('faq3Q'), answer: t('faq3A') }
    ];

    const steps = [
        { icon: MapPin, title: t('step1Title'), desc: t('step1Desc') },
        { icon: Handshake, title: t('step2Title'), desc: t('step2Desc') },
        { icon: ShieldCheck, title: t('step3Title'), desc: t('step3Desc') },
        { icon: FileText, title: t('step4Title'), desc: t('step4Desc') },
        { icon: Landmark, title: t('step5Title'), desc: t('step5Desc') }
    ];

    return (
        <div className="min-h-screen bg-white font-outfit">
            {/* Hero Section */}
            <section className="bg-navy-900 text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-transparent z-10" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://res.cloudinary.com/drl5nvyto/image/upload/v1731610484/lass-realty/n7o6zck75q0t53euzcsm.jpg')] bg-cover bg-center" />
                <div className="max-w-4xl mx-auto relative z-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-cormorant text-champagne-400 mb-6 drop-shadow-lg">
                        {t('title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light drop-shadow-md">
                        {t('subtitle')}
                    </p>
                </div>
            </section>

            {/* Buying Process Steps */}
            <section className="py-24 max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-navy-900 tracking-tight">{t('stepsTitle')}</h2>
                    <div className="w-24 h-1 bg-champagne-500 mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-12 relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative flex items-start gap-8 bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 rounded-full bg-navy-900 text-champagne-400 flex items-center justify-center shrink-0 shadow-lg relative z-10">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-navy-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQs */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-navy-900 tracking-tight">{t('faqTitle')}</h2>
                        <div className="w-24 h-1 bg-champagne-500 mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100">
                        <FAQAccordion items={faqs} />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-champagne-500 text-navy-900 text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold font-cormorant mb-6">{t('ctaTitle')}</h2>
                    <p className="text-xl md:text-2xl opacity-90 mb-10">{t('ctaDesc')}</p>
                    <Link
                        href={`/${locale}/contact`}
                        className="inline-flex items-center gap-3 bg-navy-900 text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-navy-800 transition-transform hover:-translate-y-1 shadow-2xl"
                    >
                        {t('ctaButton')} <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
