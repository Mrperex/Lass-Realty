import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Trophy, DollarSign, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60;

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Portfolio' });
    return {
        title: t('pageTitle'),
        description: t('description'),
    };
}

export default async function PortfolioPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const t = await getTranslations('Portfolio');
    await connectToDatabase();

    // Fetch all sold properties
    const rawSold = await Property.find({ status: 'sold' }).sort({ updatedAt: -1 }).lean();
    const soldProperties = JSON.parse(JSON.stringify(rawSold));

    // Calculate stats
    const totalSold = soldProperties.length;
    const totalValue = soldProperties.reduce((sum: number, p: any) => sum + (p.price || 0), 0);

    return (
        <main className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header*/}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center bg-gold-500/10 text-gold-600 px-4 py-2 rounded-full mb-6 font-outfit font-semibold text-sm tracking-wider uppercase">
                        <Trophy className="w-4 h-4 mr-2" />
                        {t('provenResults')}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-cormorant font-medium text-navy-900 mb-6">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-gray-600 font-outfit">
                        {t('description')}
                    </p>
                </div>

                {/* Stats Row */}
                {totalSold > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto">
                        <div className="text-center p-6 bg-slate-50 border border-gray-100">
                            <p className="text-3xl md:text-4xl font-cormorant font-bold text-navy-900">{totalSold}</p>
                            <p className="text-sm text-gray-500 font-outfit mt-1">{t('propertiesSold')}</p>
                        </div>
                        <div className="text-center p-6 bg-slate-50 border border-gray-100">
                            <p className="text-3xl md:text-4xl font-cormorant font-bold text-navy-900">${(totalValue / 1000000).toFixed(1)}M</p>
                            <p className="text-sm text-gray-500 font-outfit mt-1">{t('totalValue')}</p>
                        </div>
                        <div className="text-center p-6 bg-slate-50 border border-gray-100 col-span-2 md:col-span-1">
                            <p className="text-3xl md:text-4xl font-cormorant font-bold text-gold-500">100%</p>
                            <p className="text-sm text-gray-500 font-outfit mt-1">{locale === 'es' ? 'Satisfacción del Cliente' : 'Client Satisfaction'}</p>
                        </div>
                    </div>
                )}

                {/* Sold Properties Grid */}
                {soldProperties.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 border border-gray-100">
                        <p className="text-gray-500 font-outfit">
                            {locale === 'es' ? 'Portafolio en construcción. ¡Vuelva pronto!' : 'Portfolio coming soon. Check back shortly!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {soldProperties.map((property: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const propContext: any = property;
                            const title = propContext[`title_${locale}`] || property.title;
                            const city = propContext[`city_${locale}`] || property.city;

                            return (
                                <div
                                    key={property._id}
                                    className="group bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                        {property.images?.[0] ? (
                                            <Image
                                                src={property.images[0]}
                                                alt={title}
                                                fill
                                                className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-navy-900 flex items-center justify-center">
                                                <Trophy className="w-8 h-8 text-gold-500/40" />
                                            </div>
                                        )}
                                        {/* Sold Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-red-600 text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 font-outfit">
                                                {locale === 'es' ? 'VENDIDA' : 'SOLD'}
                                            </span>
                                        </div>
                                        {/* Achieved Price */}
                                        <div className="absolute bottom-4 right-4">
                                            <span className="bg-navy-900/90 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 font-outfit">
                                                <DollarSign className="w-3.5 h-3.5 inline mr-0.5" />
                                                {property.price?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-cormorant font-medium text-navy-900 line-clamp-1 mb-1">
                                            {title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-outfit flex items-center mb-3">
                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                            {city}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 font-outfit">
                                            <span>{property.bedrooms} {locale === 'es' ? 'Hab' : 'Beds'}</span>
                                            <span>{property.bathrooms} {locale === 'es' ? 'Baños' : 'Baths'}</span>
                                            <span>{property.squareMeters} m²</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-16 pt-12 border-t border-gray-100">
                    <h2 className="text-2xl font-cormorant font-medium text-navy-900 mb-4">
                        {locale === 'es' ? '¿Listo para vender su propiedad?' : 'Ready to sell your property?'}
                    </h2>
                    <p className="text-gray-600 font-outfit mb-6 max-w-md mx-auto">
                        {locale === 'es'
                            ? 'Nuestro equipo entrega resultados excepcionales. Contáctenos hoy.'
                            : 'Our team delivers exceptional results. Contact us today.'}
                    </p>
                    <Link
                        href={`/${locale}/contact`}
                        className="inline-flex items-center bg-navy-900 hover:bg-navy-800 text-white px-8 py-3.5 font-outfit text-sm uppercase tracking-wider transition-colors"
                    >
                        {locale === 'es' ? 'Contáctenos' : 'Get In Touch'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
