'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Mail, Phone, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { IAgent } from '@/models/Agent';

interface AgentProfileCardProps {
    agent: IAgent;
}

export default function AgentProfileCard({ agent }: AgentProfileCardProps) {
    const t = useTranslations('PropertyDetail');

    return (
        <div className="mt-12 pt-12 border-t border-slate-100 font-outfit">
            <h2 className="font-cormorant text-2xl md:text-3xl font-medium text-navy-900 mb-8">
                {t('listedBy', { fallback: 'Listed By' })}
            </h2>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative overflow-hidden group">
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    {/* Agent Photo */}
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                        <Image
                            src={agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400'}
                            alt={agent.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 128px, 160px"
                        />
                    </div>

                    {/* Agent Details */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
                                    {agent.name}
                                    <CheckCircle2 className="w-5 h-5 text-champagne-500" />
                                </h3>
                                <p className="text-champagne-600 font-medium">{agent.role}</p>
                            </div>

                            {/* Tags/Languages */}
                            {agent.languages && agent.languages.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {agent.languages.map(lang => (
                                        <span key={lang} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-100">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                            {agent.bio}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                            <a
                                href={`mailto:${agent.email}`}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Email Agent
                            </a>
                            <a
                                href={`tel:${agent.phone}`}
                                className="flex-1 flex items-center justify-center gap-2 bg-white text-navy-900 border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                Call Now
                            </a>
                            {agent.whatsapp && (
                                <a
                                    href={`https://wa.me/${agent.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 px-6 py-3 rounded-xl font-bold transition-colors shrink-0"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
