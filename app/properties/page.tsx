import PropertyGrid from '@/components/PropertyGrid';
import Link from 'next/link';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';

export const revalidate = 60; // Revalidate every minute

async function getProperties() {
    try {
        await connectToDatabase();
        if (!mongoose.connection.readyState) return [];
        const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(properties));
    } catch (error) {
        console.warn('Failed to fetch properties:', error);
        return [];
    }
}

export default async function PropertiesPage() {
    const properties = await getProperties();

    return (
        <div className="py-16 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Properties</h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Browse our entire collection of exclusive luxury listings.
                    </p>
                </div>

                {/* Basic location links for Phase 3 architecture */}
                <div className="mb-8 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    <Link href="/properties" className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-medium whitespace-nowrap shadow-sm">All Properties</Link>
                    <Link href="/locations/punta-cana" className="px-6 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 whitespace-nowrap transition-colors">Punta Cana</Link>
                    <Link href="/locations/cap-cana" className="px-6 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 whitespace-nowrap transition-colors">Cap Cana</Link>
                    <Link href="/locations/bavaro" className="px-6 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 whitespace-nowrap transition-colors">Bavaro</Link>
                </div>

                <PropertyGrid properties={properties} />
            </div>
        </div>
    );
}
