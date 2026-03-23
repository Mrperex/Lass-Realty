'use client';

import { Link } from '@/navigation';
import { IProperty } from '@/types/property';
import { Bed, Bath, MapPin } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import CompareButton from './CompareButton';
import DynamicPrice from './DynamicPrice';
import UrgencyBadge from './UrgencyBadge';
import AreaDisplay from './AreaDisplay';
import { useLocale, useTranslations } from 'next-intl';
import OptimizedPropertyImage from './OptimizedPropertyImage';

interface PropertyCardProps {
    property: IProperty;
    priority?: boolean;
}

export default function PropertyCard({ property, priority = false }: PropertyCardProps) {
    const locale = useLocale();
    const t = useTranslations('PropertyCard');
    
    // Helper function to get localized property values
    const getLocalizedValue = (property: IProperty, key: string, locale: string, fallback: string) => {
        const localizedKey = `${key}_${locale}` as keyof IProperty;
        const localizedValue = property[localizedKey];
        return (typeof localizedValue === 'string' ? localizedValue : fallback);
    };
    
    const title = getLocalizedValue(property, 'title', locale, property.title);
    const city = getLocalizedValue(property, 'city', locale, property.city);
    return (
        <div className="group relative">
            <Link href={`/properties/${property.slug}`} className="block overflow-hidden rounded-none bg-white border-b border-r border-slate-100 hover:shadow-[-20px_20px_40px_-15px_rgba(17,17,17,0.08)] transition-all duration-700 hover:-translate-y-2 pb-6 mb-4">
                <div className="relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-navy-900/5">
                    {property.images && property.images.length > 0 ? (
                        <OptimizedPropertyImage
                            src={property.images[0]}
                            alt={title}
                            priority={priority}
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <span className="text-slate-500">No Image</span>
                        </div>
                    )}
                    {/* Glassmorphism Price Overlay */}
                    <div className="absolute bottom-4 left-4 bg-navy-900/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-champagne-400 font-bold tracking-wide shadow-lg z-10 font-montserrat">
                        <DynamicPrice price={property.price} period={property.rentPeriod} />
                    </div>

                    <UrgencyBadge slug={property.slug} />

                    {/* Action Buttons Container - Shifted outside the link area for distinct tap targets */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-3" onClick={(e) => e.preventDefault()}>
                        <FavoriteButton property={property} />
                        <CompareButton property={property} />
                    </div>
                </div>

                <div className="pt-8 px-4 sm:px-8 bg-gradient-to-t from-white via-white to-transparent">
                    <h3 className="font-playfair text-2xl md:text-3xl font-bold text-navy-900 mb-4 line-clamp-2 leading-snug group-hover:text-champagne-500 transition-colors duration-500 min-h-[64px] flex items-center">
                        {title}
                    </h3>
                    <div className="flex items-center text-slate-500 text-xs mb-5 font-montserrat uppercase tracking-wider font-semibold">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-champagne-500" />
                        <span className="truncate">{city}</span>
                    </div>
                    <div className="flex items-center gap-6 border-t border-slate-100 pt-6 mt-6 font-montserrat text-sm overflow-x-auto no-scrollbar whitespace-nowrap">
                        {property.type === 'land' ? (
                            <AreaDisplay squareMeters={property.squareMeters} price={property.price} />
                        ) : (
                            <>
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <Bed className="w-4 h-4 lg:w-5 lg:h-5 text-slate-300" />
                                    <span className="font-medium text-slate-500"><span className="text-navy-900 font-bold">{property.bedrooms}</span> {t('beds')}</span>
                                </div>
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <Bath className="w-4 h-4 lg:w-5 lg:h-5 text-slate-300" />
                                    <span className="font-medium text-slate-500"><span className="text-navy-900 font-bold">{property.bathrooms}</span> {t('baths')}</span>
                                </div>
                                <AreaDisplay squareMeters={property.squareMeters} />
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
