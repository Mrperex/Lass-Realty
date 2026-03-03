'use client';

import { useCompareStore } from '@/store/compareStore';
import { X, Scale, Bed, Bath, SquareSquare, Check } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import DynamicPrice from './DynamicPrice';

export default function PropertyCompareModal() {
    const { compareList, removeCompare, clearCompare } = useCompareStore();

    if (compareList.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none flex flex-col items-center justify-end font-outfit px-4 sm:px-6 pb-6 lg:pb-8">
            {/* The Box */}
            <div className="bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-6 md:p-8 w-full max-w-5xl pointer-events-auto transition-all duration-500 transform translate-y-0">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-champagne-500/20 rounded-full">
                            <Scale className="w-5 h-5 text-champagne-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Property Comparison {compareList.length}/2</h2>
                    </div>
                    <button onClick={clearCompare} className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 text-sm font-bold tracking-wider uppercase">
                        Clear All <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* Divider for Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

                    {compareList.map((property, idx) => (
                        <div key={property._id} className="relative flex flex-col">
                            <button
                                onClick={() => removeCompare(property._id as string)}
                                className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 rounded-full text-white hover:bg-rose-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                                <Image
                                    src={property.images[0] || 'https://images.unsplash.com/photo-1613490900233-a3d82db45e8e?auto=format&fit=crop&q=80'}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-2 left-2 bg-navy-900/80 backdrop-blur-sm px-3 py-1 rounded-lg text-champagne-400 font-bold text-sm">
                                    <DynamicPrice price={property.price} />
                                </div>
                            </div>

                            <h3 className="text-xl font-playfair font-bold text-white mb-1 truncate">{property.title}</h3>
                            <p className="text-sm font-bold tracking-widest text-champagne-500 uppercase mb-4">{property.city}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 mb-6 border-t border-b border-white/5 py-4">
                                <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-xl">
                                    <Bed className="w-4 h-4 text-slate-400 mb-1" />
                                    <span className="text-white font-bold">{property.bedrooms}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-xl">
                                    <Bath className="w-4 h-4 text-slate-400 mb-1" />
                                    <span className="text-white font-bold">{property.bathrooms}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-xl">
                                    <SquareSquare className="w-4 h-4 text-slate-400 mb-1" />
                                    <span className="text-white font-bold">{property.squareMeters}</span>
                                </div>
                            </div>

                            {/* Amenities List */}
                            <div className="flex flex-col gap-2 mb-6 flex-grow">
                                {[
                                    { key: 'pool', label: 'Private Pool' },
                                    { key: 'oceanView', label: 'Ocean View' },
                                    { key: 'golfView', label: 'Golf View' },
                                    { key: 'furnished', label: 'Furnished' }
                                ].map(amenity => (
                                    <div key={amenity.key} className="flex items-center text-sm">
                                        {(property as any)[amenity.key] ? (
                                            <Check className="w-4 h-4 text-emerald-400 mr-3" />
                                        ) : (
                                            <X className="w-4 h-4 text-rose-400/50 mr-3" />
                                        )}
                                        <span className={(property as any)[amenity.key] ? 'text-slate-200' : 'text-slate-500'}>{amenity.label}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={`/properties/${property.slug}`}
                                className="w-full py-3 bg-white/10 hover:bg-champagne-500 hover:text-navy-900 border border-white/20 hover:border-transparent text-white text-center rounded-xl font-bold uppercase tracking-widest text-xs transition-all mt-auto"
                            >
                                View Full Listing
                            </Link>

                        </div>
                    ))}

                    {/* Empty Slot Placeholder */}
                    {compareList.length === 1 && (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl h-full min-h-[400px]">
                            <Scale className="w-12 h-12 text-white/20 mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm text-center max-w-[200px]">Select another property to compare</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
