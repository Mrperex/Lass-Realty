import Image from 'next/image';
import Link from 'next/link';
import { IProperty } from '@/types/property';
import { formatCurrency } from '@/lib/utils';
import { Bed, Bath, MapPin } from 'lucide-react';

export default function PropertyCard({ property }: { property: IProperty }) {
    return (
        <Link href={`/properties/${property.slug}`} className="group block overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                {property.images && property.images.length > 0 ? (
                    <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-slate-900 shadow-sm z-10">
                    {formatCurrency(property.price)}
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-slate-600 transition-colors">
                    {property.title}
                </h3>
                <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{property.city}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{property.bedrooms}</span> Beds
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{property.bathrooms}</span> Baths
                    </div>
                </div>
            </div>
        </Link>
    );
}
