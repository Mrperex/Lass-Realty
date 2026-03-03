
import connectToDatabase from '@/lib/mongodb';
import Neighborhood from '@/models/Neighborhood';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, DollarSign, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function NeighborhoodsIndexPage({
    params: { locale }
}: {
    params: { locale: string }
}) {


    await connectToDatabase();
    const rawNeighborhoods = await Neighborhood.find().sort({ name: 1 }).lean();
    const neighborhoods = JSON.parse(JSON.stringify(rawNeighborhoods));

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-playfair font-medium text-navy-900 mb-6">
                        {locale === 'es' ? 'Guías de Vecindarios' : 'Neighborhood Guides'}
                    </h1>
                    <p className="text-lg text-gray-600 font-outfit">
                        {locale === 'es'
                            ? 'Explore las comunidades de lujo más exclusivas de la República Dominicana. Cada guía incluye precios promedio, highlights y listados activos de propiedades.'
                            : 'Explore the most exclusive luxury communities in the Dominican Republic. Each guide includes average prices, key highlights, and active property listings.'}
                    </p>
                </div>

                {/* Grid */}
                {neighborhoods.length === 0 ? (
                    <div className="text-center py-20 bg-white shadow-sm border border-gray-100">
                        <p className="text-gray-500 font-outfit">
                            {locale === 'es' ? 'No hay guías publicadas todavía.' : 'No neighborhood guides published yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {neighborhoods.map((n: any) => {
                            const name = (locale === 'es' && n.name_es) ? n.name_es : n.name;
                            const description = (locale === 'es' && n.description_es) ? n.description_es : n.description;

                            return (
                                <Link
                                    href={`/${locale}/neighborhoods/${n.slug}`}
                                    key={n._id}
                                    className="group bg-white flex flex-col h-full shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                >
                                    {/* Hero Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                        {n.heroImage ? (
                                            <Image
                                                src={n.heroImage}
                                                alt={name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center">
                                                <MapPin className="w-10 h-10 text-gold-500/60" />
                                            </div>
                                        )}
                                        {/* Overlay name */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                            <h3 className="text-2xl font-playfair font-medium text-white">
                                                {name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        {/* Average Price */}
                                        {n.averagePrice > 0 && (
                                            <div className="flex items-center text-sm text-gray-500 font-outfit mb-3">
                                                <DollarSign className="w-4 h-4 mr-1 text-gold-500" />
                                                {locale === 'es' ? 'Precio promedio: ' : 'Avg. price: '}
                                                <span className="font-semibold text-navy-900 ml-1">
                                                    ${n.averagePrice.toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-gray-600 font-outfit text-sm line-clamp-3 mb-6 flex-1">
                                            {description?.substring(0, 160)}...
                                        </p>

                                        {/* Highlights Pills */}
                                        {((locale === 'es' && n.highlights_es?.length > 0) ? n.highlights_es : n.highlights)?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-5">
                                                {((locale === 'es' && n.highlights_es?.length > 0) ? n.highlights_es : n.highlights).slice(0, 3).map((h: string, i: number) => (
                                                    <span key={i} className="bg-slate-100 text-navy-900 text-xs font-outfit font-medium px-3 py-1 border border-gray-200">
                                                        {h}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center text-sm font-semibold text-gold-500 font-outfit tracking-wide uppercase mt-auto group-hover:text-gold-600 transition-colors">
                                            {locale === 'es' ? 'Explorar Guía' : 'Explore Guide'}
                                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
