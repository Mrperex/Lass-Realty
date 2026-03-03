
import connectToDatabase from '@/lib/mongodb';
import Neighborhood from '@/models/Neighborhood';
import Property from '@/models/Property';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, DollarSign, ArrowLeft, CheckCircle2, Home } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

// Dynamic SEO metadata
export async function generateMetadata({
    params: { locale, slug }
}: {
    params: { locale: string; slug: string }
}): Promise<Metadata> {
    await connectToDatabase();
    const neighborhood = await Neighborhood.findOne({ slug }).lean();
    if (!neighborhood) return {};

    const n = JSON.parse(JSON.stringify(neighborhood));
    const name = (locale === 'es' && n.name_es) ? n.name_es : n.name;
    const description = (locale === 'es' && n.description_es) ? n.description_es : n.description;

    return {
        title: `${name} — ${locale === 'es' ? 'Guía del Vecindario' : 'Neighborhood Guide'} | LASS Realty`,
        description: description?.substring(0, 160),
        openGraph: {
            title: name,
            description: description?.substring(0, 160),
            images: n.heroImage ? [{ url: n.heroImage }] : [],
        },
    };
}

export default async function NeighborhoodDetailPage({
    params: { locale, slug }
}: {
    params: { locale: string; slug: string }
}) {


    await connectToDatabase();
    const rawNeighborhood = await Neighborhood.findOne({ slug }).lean();
    if (!rawNeighborhood) notFound();

    const n = JSON.parse(JSON.stringify(rawNeighborhood));

    // Bilingual getters
    const name = (locale === 'es' && n.name_es) ? n.name_es : n.name;
    const description = (locale === 'es' && n.description_es) ? n.description_es : n.description;
    const highlights = (locale === 'es' && n.highlights_es?.length > 0) ? n.highlights_es : n.highlights;

    // Fetch matching properties by citySlug
    const rawProperties = await Property.find({ citySlug: slug, status: 'for-sale' })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();
    const properties = JSON.parse(JSON.stringify(rawProperties));

    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <div className="relative w-full h-[55vh] md:h-[65vh]">
                {n.heroImage ? (
                    <Image
                        src={n.heroImage}
                        alt={name}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto">
                    <Link
                        href={`/${locale}/neighborhoods`}
                        className="text-white/70 hover:text-white text-sm font-outfit mb-4 inline-flex items-center transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {locale === 'es' ? 'Todos los Vecindarios' : 'All Neighborhoods'}
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-playfair font-medium text-white leading-tight mt-2">
                        {name}
                    </h1>
                    {n.averagePrice > 0 && (
                        <div className="flex items-center mt-4 text-white/80 font-outfit text-lg">
                            <DollarSign className="w-5 h-5 mr-2 text-gold-500" />
                            {locale === 'es' ? 'Precio promedio: ' : 'Average price: '}
                            <span className="font-semibold text-gold-500 ml-1">
                                ${n.averagePrice.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Main Description */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-playfair font-medium text-navy-900 mb-6">
                            {locale === 'es' ? 'Sobre esta Comunidad' : 'About this Community'}
                        </h2>
                        <div
                            className="prose prose-lg prose-slate max-w-none font-outfit
                                prose-headings:font-playfair prose-headings:text-navy-900
                                prose-a:text-gold-500 prose-a:underline-offset-4"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>

                    {/* Highlights Sidebar */}
                    <div>
                        {highlights?.length > 0 && (
                            <div className="bg-slate-50 border border-gray-100 p-8 sticky top-32">
                                <h3 className="text-lg font-playfair font-medium text-navy-900 mb-6 pb-4 border-b border-gray-200">
                                    {locale === 'es' ? 'Aspectos Destacados' : 'Key Highlights'}
                                </h3>
                                <ul className="space-y-4">
                                    {highlights.map((highlight: string, index: number) => (
                                        <li key={index} className="flex items-start text-sm font-outfit text-gray-700">
                                            <CheckCircle2 className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0 mt-0.5" />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Properties Section */}
            {properties.length > 0 && (
                <section className="bg-slate-50 py-16 md:py-24 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-playfair font-medium text-navy-900 mb-2">
                                    {locale === 'es'
                                        ? `Propiedades en ${name}`
                                        : `Properties in ${name}`}
                                </h2>
                                <p className="text-gray-600 font-outfit">
                                    {locale === 'es'
                                        ? `${properties.length} listado(s) activo(s) disponible(s)`
                                        : `${properties.length} active listing(s) available`}
                                </p>
                            </div>
                            <Link
                                href={`/${locale}/properties?location=${slug}`}
                                className="mt-4 md:mt-0 bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 text-sm font-outfit uppercase tracking-wider transition-colors"
                            >
                                {locale === 'es' ? 'Ver Todas las Propiedades' : 'View All Properties'}
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property: any) => {
                                const pTitle = (locale === 'es' && property.title_es) ? property.title_es : property.title;
                                return (
                                    <Link
                                        key={property._id}
                                        href={`/${locale}/properties/${property.slug}`}
                                        className="group bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                            {property.images?.[0] ? (
                                                <Image
                                                    src={property.images[0]}
                                                    alt={pTitle}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Home className="w-8 h-8 text-gray-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-navy-900/90 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 font-outfit">
                                                ${property.price?.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-playfair font-medium text-navy-900 mb-1 group-hover:text-gold-500 transition-colors line-clamp-1">
                                                {pTitle}
                                            </h3>
                                            <p className="text-sm text-gray-500 font-outfit flex items-center">
                                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                                {(locale === 'es' && property.city_es) ? property.city_es : property.city}
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-outfit">
                                                <span>{property.bedrooms} {locale === 'es' ? 'Hab' : 'Beds'}</span>
                                                <span>{property.bathrooms} {locale === 'es' ? 'Baños' : 'Baths'}</span>
                                                <span>{property.squareMeters} m²</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
