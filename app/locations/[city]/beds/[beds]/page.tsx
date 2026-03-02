import PropertyGrid from '@/components/PropertyGrid';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { IProperty } from '@/types/property';
import mongoose from 'mongoose';
import { LOCATIONS } from '@/lib/locations';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 3600; // Cache for 1 hour

function normalizeCityName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Pre-render combinations of priority cities + existing bedroom counts
export async function generateStaticParams() {
    await connectToDatabase();
    if (!mongoose.connection.readyState) return [];

    const params: { city: string, beds: string }[] = [];

    const priorityCities = LOCATIONS.filter(loc => loc.priority);

    for (const location of priorityCities) {
        const normalizedCity = normalizeCityName(location.slug);

        try {
            const distinctBeds = await Property.distinct('bedrooms', {
                city: { $regex: new RegExp(`^${normalizedCity}$`, 'i') }
            });

            for (const beds of distinctBeds) {
                if (beds !== null && beds !== undefined) {
                    params.push({
                        city: location.slug,
                        beds: beds.toString()
                    });
                }
            }
        } catch (error) {
            console.warn(`Could not generate static params for beds in ${location.slug}`, error);
        }
    }

    return params;
}

export async function generateMetadata({ params }: { params: { city: string, beds: string } }) {
    const cityName = normalizeCityName(params.city);
    const bedCount = params.beds;

    return {
        title: `${bedCount} Bedroom Properties for Sale in ${cityName} | LASS Realty`,
        description: `Explore exclusive ${bedCount} bedroom luxury real estate and premium properties for sale in ${cityName}. Find your ideal ${bedCount} bedroom home with LASS Realty.`,
        openGraph: {
            title: `${bedCount} Bedroom Properties in ${cityName}`,
            description: `Browse ${bedCount} bedroom luxury real estate listings in ${cityName}.`,
        }
    };
}

async function getProperties(city: string, beds: string): Promise<IProperty[]> {
    try {
        await connectToDatabase();
        if (!mongoose.connection.readyState) return [];

        const normalizedCity = normalizeCityName(city);
        const bedCount = parseInt(beds, 10);

        if (isNaN(bedCount)) return [];

        const properties = await Property.find({
            citySlug: city,
            bedrooms: bedCount
        }).sort({ createdAt: -1 }).lean();

        return JSON.parse(JSON.stringify(properties));
    } catch (error) {
        console.warn(`Failed to fetch properties for city ${city} and beds ${beds}:`, error);
        return [];
    }
}

export default async function BedLocationPage({ params }: { params: { city: string, beds: string } }) {
    const cityName = normalizeCityName(params.city);
    const bedCount = params.beds;
    const properties = await getProperties(params.city, params.beds);

    return (
        <div className="py-16 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        href={`/locations/${params.city}`}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to {cityName}
                    </Link>
                </div>

                {/* SEO Text Block & Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
                        {bedCount} Bedroom Properties in {cityName}
                    </h1>
                    <div className="prose prose-slate max-w-3xl">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Discover the finest selection of <strong>{bedCount} bedroom luxury real estate</strong> in <strong>{cityName}</strong>.
                            Whether you are seeking a spacious family home, a comfortable vacation retreat, or a strategic
                            investment property, our curated portfolio of {bedCount} bedroom listings represents the pinnacle
                            of premium living in the Dominican Republic. Explore our handpicked properties below to find
                            your perfect match in {cityName}.
                        </p>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Available
                    </div>
                </div>

                {/* Property Grid */}
                {properties.length > 0 ? (
                    <PropertyGrid properties={properties} />
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No {bedCount} bedroom properties currently found in {cityName}</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            We are constantly updating our exclusive portfolio. Check back soon or contact us to find
                            off-market opportunities matching your criteria.
                        </p>
                        <Link
                            href={`/locations/${params.city}`}
                            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
                        >
                            View all properties in {cityName}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
