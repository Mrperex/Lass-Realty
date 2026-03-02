import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { formatCurrency } from '@/lib/utils';
import { Bed, Bath, MapPin, ArrowLeft } from 'lucide-react';
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const property = await getProperty(params.slug);
    if (!property) return { title: 'Not Found' };

    return {
        title: `${property.title} | LASS Realty`,
        description: property.description.substring(0, 160),
        openGraph: {
            images: property.images && property.images.length > 0 ? [property.images[0]] : [],
        }
    };
}

export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
    const property = await getProperty(params.slug);

    if (!property) {
        notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            <TrackPropertyView slug={property.slug} />
            {/* Gallery Section */}
            <div className="w-full relative bg-slate-900">
                <PropertyGallery images={property.images} title={property.title} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 transition-all duration-500">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                                        {property.title}
                                    </h1>
                                    <div className="text-3xl md:text-4xl font-light text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
                                        {formatCurrency(property.price)}
                                    </div>
                                </div>

                                <div className="flex items-center text-slate-500 text-lg">
                                    <MapPin className="w-5 h-5 mr-2 text-slate-400" />
                                    {property.city}
                                </div>
                            </div>

                            <div className="flex items-center gap-8 py-8 border-y border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 shadow-inner"><Bed className="w-7 h-7" /></div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bedrooms</div>
                                        <div className="text-2xl font-bold text-slate-900">{property.bedrooms}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 shadow-inner"><Bath className="w-7 h-7" /></div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bathrooms</div>
                                        <div className="text-2xl font-bold text-slate-900">{property.bathrooms}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Description</h2>
                                <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line font-light">
                                    {property.description}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Contact */}
                        <div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-28">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Request Information</h3>
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
                            Properties in {property.city}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
