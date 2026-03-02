import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import PropertyGrid from '@/components/PropertyGrid';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { LOCATIONS } from '@/lib/locations';

export const revalidate = 3600;

async function getFeaturedProperties() {
    try {
        await connectToDatabase();
        if (!mongoose.connection.readyState) return [];
        const properties = await Property.find({ featured: true }).limit(3).lean();
        return JSON.parse(JSON.stringify(properties));
    } catch (error) {
        console.warn('Failed to fetch featured properties:', error);
        return [];
    }
}

export default async function Home() {
    const featuredProperties = await getFeaturedProperties();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-900/40 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Luxury Real Estate"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        Find Your Dream Home
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-100 mb-10 max-w-2xl mx-auto font-light drop-shadow">
                        Exclusive luxury real estate listings tailored to your lifestyle in Punta Cana and beyond.
                    </p>
                    <Link
                        href="/properties"
                        className="inline-flex items-center bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition shadow-xl hover:scale-105 duration-300 transform"
                    >
                        Explore Properties
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Featured Properties Container */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Featured Properties</h2>
                            <p className="text-slate-600 max-w-2xl">Handpicked luxury homes available right now.</p>
                        </div>
                        <Link href="/properties" className="hidden sm:flex text-slate-900 font-semibold items-center hover:text-amber-600 transition-colors">
                            View All <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>

                    <PropertyGrid properties={featuredProperties} />

                    <div className="mt-12 text-center sm:hidden">
                        <Link href="/properties" className="inline-flex items-center text-slate-900 font-semibold hover:text-amber-600 transition-colors">
                            View All Properties <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Locations Mesh Section */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Browse by Location</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Discover exclusive communities and premium neighborhoods across the Dominican Republic.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {LOCATIONS.filter(loc => loc.priority).slice(0, 4).map((location) => (
                            <Link
                                key={location.slug}
                                href={`/locations/${location.slug}`}
                                className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all duration-300 text-center"
                            >
                                <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                                    <MapPin className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{location.name}</h3>
                                <div className="text-slate-500 text-sm">View Properties</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
