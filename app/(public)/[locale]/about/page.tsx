import Image from 'next/image';
import { ShieldCheck, Award, MapPin, CheckCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import WhatsAppButton from '@/components/WhatsAppButton';
import connectToDatabase from '@/lib/mongodb';
import Agent from '@/models/Agent';
import { Mail, Phone } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: `${t('title')} | LASS Realty`,
        description: t('description'),
    };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'About' });

    await connectToDatabase();
    const agents = await Agent.find().sort({ createdAt: 1 }).lean();

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

            {/* Meet Our Agents Section */}
            {agents && agents.length > 0 && (
                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
                            {t('meetAgentsTitle', { fallback: 'Meet Our Experts' })}
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                            {t('meetAgentsDesc', { fallback: 'Dedicated professionals with deep market knowledge and a commitment to excellence.' })}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {agents.map((agent: any) => {
                            const name = agent.name;
                            const role = agent[`role_${locale}`] || agent.role;
                            const bio = agent[`bio_${locale}`] || agent.bio;
                            const languages = agent[`languages_${locale}`] || agent.languages || [];

                            return (
                                <div key={agent._id.toString()} className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 group hover:-translate-y-2 transition-all duration-500 flex flex-col">
                                    <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                                        <Image
                                            src={agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80'}
                                            alt={name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-900/80 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{name}</h3>
                                            <div className="text-amber-400 text-xs font-semibold tracking-widest uppercase drop-shadow">{role}</div>
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-4 flex-grow">{bio}</p>

                                        {languages.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {languages.map((lang: string) => (
                                                    <span key={lang} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-medium border border-slate-100">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6">
                                            {agent.email && (
                                                <a href={`mailto:${agent.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-amber-600 transition-colors">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    <span className="truncate">{agent.email}</span>
                                                </a>
                                            )}
                                            {(agent.phone || agent.whatsapp) && (
                                                <a href={agent.whatsapp ? `https://wa.me/${agent.whatsapp.replace(/\D/g, '')}` : `tel:${agent.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-green-600 transition-colors">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                    <span>{agent.whatsapp || agent.phone}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

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
