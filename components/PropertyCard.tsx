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
        <Link href={`/properties/${property.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(10,17,40,0.15)] transition-all duration-500">
            <div className="relative aspect-[4/3] overflow-hidden bg-navy-900/10">
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

                {/* Favorite & Compare Action Buttons */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <FavoriteButton property={property} />
                    <CompareButton property={property} />
                </div>
            </div>
            <div className="p-6">
                <h3 className="font-playfair text-xl font-medium text-navy-900 mb-3 truncate group-hover:text-champagne-500 transition-colors duration-300">
                    {title}
                </h3>
                <div className="flex items-center text-slate-500 text-sm mb-5 font-outfit uppercase tracking-wider text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-champagne-500" />
                    <span className="truncate">{city}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600 border-t border-slate-100 pt-5 font-outfit">
                    <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-navy-800" />
                        <span className="font-semibold text-navy-900">{property.bedrooms}</span> {t('beds')}
                    </div>
                    <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-navy-800" />
                        <span className="font-semibold text-navy-900">{property.bathrooms}</span> {t('baths')}
                    </div>
                </div>
            </div>
        </Link>
    );
}
