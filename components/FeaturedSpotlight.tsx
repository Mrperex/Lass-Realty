import Image from 'next/image';
import { Link } from '@/navigation';
import { IProperty } from '@/types/property';
import { ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';
import DynamicPrice from './DynamicPrice';
import FavoriteButton from './FavoriteButton';

export default function FeaturedSpotlight({ property }: { property: IProperty | null }) {
    if (!property) return null;

    return (
        <section className="py-24 bg-slate-50 border-t border-slate-200/60 overflow-hidden relative font-outfit">
            {/* Editorial Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-navy-900/5 hidden lg:block border-l border-slate-200/50" />
            <div className="absolute -top-[10%] -right-[5%] w-[40rem] h-[40rem] rounded-full bg-champagne-500/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px w-12 bg-champagne-500" />
                    <span className="text-champagne-600 font-bold tracking-[0.2em] uppercase text-sm">Estate of the Month</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-stretch">
                    {/* Magazine Imagery Column */}
                    <div className="w-full lg:w-7/12 relative group rounded-md overflow-hidden shadow-2xl">
                        <Link href={`/properties/${property.slug}`} className="block relative w-full h-[60vh] lg:h-full min-h-[500px]">
                            {property.images && property.images.length > 0 ? (
                                <Image
                                    src={property.images[0]}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-80" />

                            <div className="absolute top-6 right-6 z-20">
                                <FavoriteButton property={property} />
                            </div>
                        </Link>

                        {/* Staggered Offset Image (Editorial Aesthetic) */}
                        {property.images && property.images.length > 1 && (
                            <div className="absolute -bottom-8 -right-8 w-1/3 aspect-[4/5] rounded shadow-2xl border-4 border-slate-50 hidden md:block overflow-hidden pointer-events-none">
                                <Image
                                    src={property.images[1]}
                                    alt="Property Detail"
                                    fill
                                    className="object-cover"
                                    sizes="25vw"
                                />
                            </div>
                        )}
                    </div>

                    {/* Magazine Typography Column */}
                    <div className="w-full lg:w-5/12 flex flex-col justify-center py-8 lg:py-16">
                        <div className="flex items-center text-slate-500 text-sm font-semibold uppercase tracking-widest mb-6">
                            <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                            {property.city}
                        </div>

                        <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium text-navy-900 tracking-tight leading-[1.1] mb-8">
                            {property.title}
                        </h2>

                        <div className="font-outfit text-3xl font-semibold text-champagne-600 mb-8">
                            <DynamicPrice price={property.price} />
                        </div>

                        <p className="text-lg text-slate-600 font-light leading-relaxed mb-10 border-l-2 border-champagne-300 pl-6">
                            {/* Trim description to ~150 chars for the magazine blurb */}
                            {property.description.length > 180
                                ? property.description.substring(0, 180) + '...'
                                : property.description}
                        </p>

                        <div className="grid grid-cols-3 gap-6 mb-12 py-8 border-y border-slate-200/60">
                            <div className="flex flex-col">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> Beds</span>
                                <span className="text-2xl font-playfair font-semibold text-navy-900">{property.bedrooms}</span>
                            </div>
                            <div className="flex flex-col border-l border-slate-200/60 pl-6">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> Baths</span>
                                <span className="text-2xl font-playfair font-semibold text-navy-900">{property.bathrooms}</span>
                            </div>
                            <div className="flex flex-col border-l border-slate-200/60 pl-6">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><Square className="w-3.5 h-3.5" /> Size</span>
                                <span className="text-lg font-playfair font-semibold text-navy-900 mt-1">{property.squareMeters ? `${property.squareMeters} m²` : '--'}</span>
                            </div>
                        </div>

                        <div>
                            <Link
                                href={`/properties/${property.slug}`}
                                className="group inline-flex items-center justify-center bg-navy-900 text-offwhite px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl transition-all hover:bg-navy-800 hover:shadow-2xl hover:-translate-y-1"
                            >
                                View Estate Gallery
                                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
