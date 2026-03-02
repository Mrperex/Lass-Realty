import PropertyGrid from '@/components/PropertyGrid';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { IProperty } from '@/types/property';
import mongoose from 'mongoose';
import { LOCATIONS } from '@/lib/locations';

export const revalidate = 3600; // Cache for 1 hour

// Pre-render pages for priority cities at build time
export async function generateStaticParams() {
    return LOCATIONS.filter(loc => loc.priority).map((location) => ({
        city: location.slug,
    }));
}

// Helper to normalize URL slug to display friendly name
// e.g., 'punta-cana' -> 'Punta Cana'
function normalizeCityName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Generates dynamic SEO metadata based on the city
export async function generateMetadata({ params }: { params: { city: string } }) {
    const cityName = normalizeCityName(params.city);

    return {
        title: `Luxury Properties in ${cityName} | LASS Realty`,
        description: `Explore exclusive luxury real estate and premium properties for sale in ${cityName}. Discover your dream home with LASS Realty.`,
        openGraph: {
            title: `Properties in ${cityName}`,
            description: `Browse luxury real estate listings in ${cityName}.`,
        }
    };
}

async function getPropertiesByCity(city: string): Promise<IProperty[]> {
    try {
        await connectToDatabase();
        if (!mongoose.connection.readyState) return [];

        const normalizedCity = normalizeCityName(city);

        // Case-insensitive regex match for city
        const properties = await Property.find({
            city: { $regex: new RegExp(`^${normalizedCity}$`, 'i') }
        }).sort({ createdAt: -1 }).lean();

        return JSON.parse(JSON.stringify(properties));
    } catch (error) {
        console.warn(`Failed to fetch properties for city ${city}:`, error);
        return [];
    }
}

export default async function LocationPage({ params }: { params: { city: string } }) {
    const cityName = normalizeCityName(params.city);
    const properties = await getPropertiesByCity(params.city);

    // Calculate distinct bedrooms for internal linking mesh
    const availableBeds = Array.from(new Set(properties.map(p => p.bedrooms))).sort((a, b) => a - b);

    return (
        <div className="py-16 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* SEO Text Block & Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
                        Luxury Properties in {cityName}
                    </h1>
                    <div className="prose prose-slate max-w-3xl">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Discover the finest selection of luxury real estate in <strong>{cityName}</strong>.
                            From breathtaking oceanfront villas to exclusive golf course estates and modern condos,
                            our curated portfolio represents the pinnacle of premium living. Whether you are seeking
                            a primary residence, a vacation retreat, or a strategic investment, explore our handpicked
                            listings below to find your perfect match in {cityName}.
                        </p>
                    </div>
                </div>

                {/* Search by Bedrooms - Internal Linking Mesh */}
                {availableBeds.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Browse {cityName} by Bedrooms</h3>
                        <div className="flex flex-wrap gap-3">
                            {availableBeds.map(beds => (
                                <Link
                                    key={beds}
                                    href={`/locations/${params.city}/beds/${beds}`}
                                    className="px-5 py-2.5 bg-white text-slate-700 hover:text-amber-600 hover:border-amber-300 border border-slate-200 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200"
                                >
                                    {beds} Bedroom Properties
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

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
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No properties currently found in {cityName}</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            We are constantly updating our exclusive portfolio. Check back soon or contact us to find
                            off-market opportunities in this area.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
