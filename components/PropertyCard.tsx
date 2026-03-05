'use client';

import Image from 'next/image';
import { Link } from '@/navigation';
import { IProperty } from '@/types/property';
import { Bed, Bath, MapPin } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import CompareButton from './CompareButton';
import DynamicPrice from './DynamicPrice';
import UrgencyBadge from './UrgencyBadge';
import { useLocale, useTranslations } from 'next-intl';

export default function PropertyCard({ property }: { property: IProperty }) {
    const locale = useLocale();
    const t = useTranslations('PropertyCard');
    const title = locale === 'es' && property.title_es ? property.title_es : property.title;
    const city = locale === 'es' && property.city_es ? property.city_es : property.city;
    return (
        <div className="group relative">
            <Link href={`/properties/${property.slug}`} className="block overflow-hidden rounded-none bg-white border-b border-r border-slate-100 hover:shadow-[-20px_20px_40px_-15px_rgba(17,17,17,0.08)] transition-all duration-700 hover:-translate-y-2 pb-6 mb-4">
                <div className="relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-navy-900/5">
                    {property.images && property.images.length > 0 ? (
                        <Image
                            src={property.images[0]}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-outfit">
                            {t('noImage')}
                        </div>
                    )}
                    {/* Glassmorphism Price Overlay */}
                    <div className="absolute bottom-4 left-4 bg-navy-900/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-champagne-400 font-bold tracking-wide shadow-lg z-10 font-outfit">
                        <DynamicPrice price={property.price} />
                    </div>

                    <UrgencyBadge slug={property.slug} />

                    {/* Action Buttons Container - Shifted outside the link area for distinct tap targets */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-3" onClick={(e) => e.preventDefault()}>
                        <FavoriteButton property={property} />
                        <CompareButton property={property} />
                    </div>
                </div>

                <div className="pt-8 px-4 sm:px-8 bg-gradient-to-t from-white via-white to-transparent">
                    <h3 className="font-cormorant text-2xl md:text-3xl font-bold text-navy-900 mb-4 line-clamp-2 leading-snug group-hover:text-champagne-500 transition-colors duration-500 min-h-[64px] flex items-center">
                        {title}
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm mb-5 font-outfit uppercase tracking-wider text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-champagne-500" />
                        <span className="truncate">{city}</span>
                    </div>
                    <div className="flex items-center gap-8 border-t border-slate-100 pt-6 mt-6 font-outfit text-sm">
                        <div className="flex items-center gap-3">
                            <Bed className="w-5 h-5 text-slate-300" />
                            <span className="font-medium text-slate-500"><span className="text-navy-900 font-bold">{property.bedrooms}</span> {t('beds')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Bath className="w-5 h-5 text-slate-300" />
                            <span className="font-medium text-slate-500"><span className="text-navy-900 font-bold">{property.bathrooms}</span> {t('baths')}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
