import Image from 'next/image';
import { Link } from '@/navigation';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { formatCurrency } from '@/lib/utils';
import { Bed, Bath, MapPin, ArrowLeft } from 'lucide-react';
import DynamicPrice from '@/components/DynamicPrice';
import MortgageCalculator from '@/components/MortgageCalculator';
import SimilarPropertiesCarousel from '@/components/SimilarPropertiesCarousel';
import Breadcrumbs from '@/components/Breadcrumbs';
import CompareButton from '@/components/CompareButton';
import VirtualTourEmbed from '@/components/VirtualTourEmbed';
import FloorPlanViewer from '@/components/FloorPlanViewer';
import LocationSpotlight from '@/components/LocationSpotlight';
import { getTranslations } from 'next-intl/server';
import ContactForm from './ContactForm';
import { TrackPropertyView } from '@/components/AnalyticsEvents';
import PropertyGallery from '@/components/PropertyGallery';

export const revalidate = 60;

async function getProperty(slug: string) {
    try {
        await connectToDatabase();
        if (!mongoose.connection.readyState) return null;
        const property = await Property.findOne({ slug }).lean();
        if (!property) return null;
        return JSON.parse(JSON.stringify(property));
    } catch (error) {
        console.warn('Failed to fetch property:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string, locale: string } }) {
    const property = await getProperty(params.slug);
    if (!property) return { title: 'Not Found' };

    const title = params.locale === 'es' && property.title_es ? property.title_es : property.title;
    const description = params.locale === 'es' && property.description_es ? property.description_es : property.description;

    return {
        title: `${title} | LASS Realty`,
        description: description.substring(0, 160),
        openGraph: {
            images: property.images && property.images.length > 0 ? [property.images[0]] : [],
        }
    };
}

export default async function PropertyDetailPage({ params }: { params: { slug: string, locale: string } }) {
    const property = await getProperty(params.slug);

    if (!property) {
        notFound();
    }

    const t = await getTranslations({ locale: params.locale, namespace: 'PropertyDetail' });

    const title = params.locale === 'es' && property.title_es ? property.title_es : property.title;
    const description = params.locale === 'es' && property.description_es ? property.description_es : property.description;
    const city = params.locale === 'es' && property.city_es ? property.city_es : property.city;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: title,
        description: description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lasspuntacana.com'}/properties/${property.slug}`,
        image: property.images,
        datePosted: property.createdAt ? new Date(property.createdAt).toISOString() : new Date().toISOString(),
        offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'USD',
            availability: property.status === 'for-sale' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: city,
            addressCountry: 'DO'
        },
        numberOfRooms: property.bedrooms,
        numberOfBathroomsTotal: property.bathrooms,
        floorSize: {
            '@type': 'QuantitativeValue',
            value: property.squareMeters,
            unitCode: 'MTK'
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TrackPropertyView property={property} />
            {/* Gallery Section */}
            <div className="w-full relative bg-slate-900">
                <PropertyGallery images={property.images} title={title} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 transition-all duration-500">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <Breadcrumbs />

                            <div>
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h1 className="font-playfair text-3xl md:text-5xl font-medium text-navy-900 tracking-tight leading-tight">
                                            {title}
                                        </h1>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                        <div className="font-outfit text-2xl md:text-3xl font-semibold text-champagne-500 bg-navy-900/5 px-5 py-2 rounded-2xl border border-navy-900/10">
                                            <DynamicPrice price={property.price} />
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <a
                                                href="#contact-section"
                                                className="px-5 py-2.5 bg-champagne-500 text-navy-900 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-champagne-400 transition-colors shadow-sm"
                                            >
                                                {t('requestShowing', { fallback: 'Request Showing' })}
                                            </a>
                                            <CompareButton property={property} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center text-slate-500 text-lg">
                                    <MapPin className="w-5 h-5 mr-2 text-slate-400" />
                                    {city}
                                </div>
                            </div>

                            {property.virtualTourUrl && (
                                <VirtualTourEmbed url={property.virtualTourUrl} />
                            )}

                            {property.floorPlans && property.floorPlans.length > 0 && (
                                <FloorPlanViewer floorPlans={property.floorPlans} />
                            )}

                            {/* Investment Calculator Integration */}
                            <div className="flex items-center gap-8 py-8 border-y border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 shadow-inner"><Bed className="w-7 h-7" /></div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('bedrooms')}</div>
                                        <div className="text-2xl font-bold text-slate-900">{property.bedrooms}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 shadow-inner"><Bath className="w-7 h-7" /></div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('bathrooms')}</div>
                                        <div className="text-2xl font-bold text-slate-900">{property.bathrooms}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('propertyDescription')}</h2>
                                <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line font-light">
                                    {description}
                                </div>
                            </div>

                            {/* Proximity / Walkability Spotlight */}
                            <LocationSpotlight city={property.city} />
                        </div>

                        {/* Sidebar / Contact */}
                        <div id="contact-section">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-28">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('requestInformation')}</h3>
                                <ContactForm propertySlug={property.slug} />
                            </div>
                        </div>
                    </div>

                    {/* Internal Linking Mesh */}
                    <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-center">
                        <Link
                            href={`/locations/${property.city.toLowerCase().replace(/\s+/g, '-')}`}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('propertiesIn', { city })}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
