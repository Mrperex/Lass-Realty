'use client';

import { useCompareStore } from '@/store/compareStore';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ShieldCheck, Calendar, MapPin, X, ArrowLeft, Bed, Bath, Maximize, Home, Building2 } from 'lucide-react';
import { Link } from '@/navigation';
import DynamicPrice from '@/components/DynamicPrice';
import { useEffect, useState } from 'react';

export default function ComparePage() {
    const { compareList, removeCompare } = useCompareStore();
    const t = useTranslations('ComparePage');

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne-500"></div>
            </div>
        );
    }

    if (compareList.length === 0) {
        return (
            <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center px-4 font-outfit text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Building2 className="w-10 h-10 text-slate-300" />
                </div>
                <h1 className="text-3xl font-cormorant font-bold text-navy-900 mb-4">{t('emptyTitle', { fallback: 'No Properties to Compare' })}</h1>
                <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg hover:text-slate-600 transition-colors">
                    {t('emptyDesc', { fallback: 'Browse our luxurious portfolio and select up to 3 properties to see them side-by-side.' })}
                </p>
                <Link
                    href="/properties"
                    className="bg-champagne-500 text-navy-900 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-champagne-400 hover:shadow-lg transition-all"
                >
                    {t('browseProperties', { fallback: 'Browse Properties' })}
                </Link>
            </div>
        );
    }

    // Helper to extract numeric values for difference highlighting
    const getHighestValue = (field: 'price' | 'bedrooms' | 'bathrooms' | 'squareMeters') => {
        if (field === 'price') return Math.min(...compareList.map(p => p.price || Infinity)); // Lower price is loosely "better" but we just want difference
        return Math.max(...compareList.map(p => p[field] || 0));
    };

    const maxBeds = getHighestValue('bedrooms');
    const maxBaths = getHighestValue('bathrooms');
    const maxSize = getHighestValue('squareMeters');
    const minPrice = getHighestValue('price');

    return (
        <div className="min-h-screen bg-slate-50 font-outfit pb-32">
            {/* Header Area */}
            <div className="bg-navy-900 text-white pt-32 pb-24 relative overflow-hidden">
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-champagne-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <Link href="/properties" className="inline-flex items-center text-champagne-400 hover:text-champagne-300 transition-colors uppercase tracking-widest text-xs font-bold mb-6 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        {t('backToSearch', { fallback: 'Back to Properties' })}
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-cormorant font-medium tracking-tight mb-4">
                        {t('title', { fallback: 'Compare Properties' })}
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
                        {t('subtitle', { fallback: 'Evaluate features, locations, and pricing side-by-side to find your perfect home in paradise.' })}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            {/* Sticky Header Row */}
                            <thead className="sticky top-0 bg-white shadow-sm z-30">
                                <tr>
                                    <th className="p-6 md:p-8 w-1/4 border-b border-slate-100 bg-slate-50 align-bottom">
                                        <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Features</span>
                                    </th>
                                    {compareList.map((property) => (
                                        <th key={property._id as string} className="p-6 md:p-8 w-1/4 border-b border-l border-slate-100 align-top relative group">
                                            <button
                                                onClick={() => removeCompare(property._id as string)}
                                                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm shadow-sm rounded-full p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
                                                aria-label="Remove property"
                                                title="Remove"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-sm">
                                                <img
                                                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80'}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            <h3 className="font-cormorant text-xl font-bold text-navy-900 mb-1 leading-tight line-clamp-2">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center text-slate-500 text-sm mb-4">
                                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                                <span className="truncate">{property.city}</span>
                                            </div>

                                            <div className="text-2xl font-bold text-champagne-600 mb-6">
                                                <DynamicPrice price={property.price} />
                                            </div>

                                            <Link
                                                href={`/properties/${property.slug}`}
                                                className="block w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-champagne-500 hover:text-navy-900 transition-colors uppercase tracking-widest text-xs"
                                            >
                                                {t('viewDetails', { fallback: 'View Details' })}
                                            </Link>
                                        </th>
                                    ))}
                                    {/* Empty Column Filler if < 3 */}
                                    {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                                        <th key={`empty-hdr-${i}`} className="p-6 md:p-8 w-1/4 border-b border-l border-slate-100 bg-slate-50/50 align-top">
                                            <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                                <span className="text-3xl font-light mb-2">+</span>
                                                <span className="text-sm font-semibold">Add Property</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {/* Price (Again for direct comparison) */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 md:p-8 font-semibold text-slate-700">Asking Price</td>
                                    {compareList.map((property) => (
                                        <td key={`price-${property._id}`} className={`p-6 md:p-8 border-l border-slate-100 font-bold text-lg ${property.price === minPrice ? 'bg-green-50/50 text-green-700' : 'text-navy-900'}`}>
                                            <DynamicPrice price={property.price} />
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-price-${i}`} className="p-6 md:p-8 border-l border-slate-100 bg-slate-50/50"></td>)}
                                </tr>

                                {/* Property Type */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 md:p-8 font-semibold text-slate-700 flex items-center gap-3"><Home className="w-5 h-5 text-slate-400" /> Property Type</td>
                                    {compareList.map((property) => (
                                        <td key={`type-${property._id}`} className="p-6 md:p-8 border-l border-slate-100 text-slate-600 capitalize">
                                            {property.type || 'N/A'}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-type-${i}`} className="p-6 md:p-8 border-l border-slate-100 bg-slate-50/50"></td>)}
                                </tr>

                                {/* Bedrooms */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 md:p-8 font-semibold text-slate-700 flex items-center gap-3"><Bed className="w-5 h-5 text-slate-400" /> Bedrooms</td>
                                    {compareList.map((property) => (
                                        <td key={`bed-${property._id}`} className={`p-6 md:p-8 border-l border-slate-100 text-lg ${property.bedrooms === maxBeds ? 'bg-champagne-50/50 text-champagne-700 font-bold' : 'text-slate-600'}`}>
                                            {property.bedrooms}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-bed-${i}`} className="p-6 md:p-8 border-l border-slate-100 bg-slate-50/50"></td>)}
                                </tr>

                                {/* Bathrooms */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 md:p-8 font-semibold text-slate-700 flex items-center gap-3"><Bath className="w-5 h-5 text-slate-400" /> Bathrooms</td>
                                    {compareList.map((property) => (
                                        <td key={`bath-${property._id}`} className={`p-6 md:p-8 border-l border-slate-100 text-lg ${property.bathrooms === maxBaths ? 'bg-champagne-50/50 text-champagne-700 font-bold' : 'text-slate-600'}`}>
                                            {property.bathrooms}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-bath-${i}`} className="p-6 md:p-8 border-l border-slate-100 bg-slate-50/50"></td>)}
                                </tr>

                                {/* Square Footage */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 md:p-8 font-semibold text-slate-700 flex items-center gap-3"><Maximize className="w-5 h-5 text-slate-400" /> Size (m²)</td>
                                    {compareList.map((property) => (
                                        <td key={`size-${property._id}`} className={`p-6 md:p-8 border-l border-slate-100 text-lg ${property.squareMeters === maxSize ? 'bg-champagne-50/50 text-champagne-700 font-bold' : 'text-slate-600'}`}>
                                            {property.squareMeters ? property.squareMeters.toLocaleString() : 'N/A'} m²
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-size-${i}`} className="p-6 md:p-8 border-l border-slate-100 bg-slate-50/50"></td>)}
                                </tr>

                                {/* Status / Days on Market logic */}
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 md:p-8 font-semibold text-slate-700 flex items-center gap-3"><Calendar className="w-5 h-5 text-slate-400" /> Status</td>
                                    {compareList.map((property) => (
                                        <td key={`status-${property._id}`} className="p-6 md:p-8 border-l border-slate-100 text-slate-600">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider bg-green-50 text-green-700 border border-green-200">
                                                {property.status || 'Active'}
                                            </span>
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareList.length }).map((_, i) => <td key={`empty-status-${i}`} className="p-6 md:p-8 border-l border-slate-100 bg-slate-50/50"></td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
