import { Link } from '@/navigation';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 3600;

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-champagne-500 rounded-full animate-spin"></div>
    </div>
});

async function getAllProperties() {
    try {
        await connectToDatabase();
        if (!mongoose.connection.readyState) return [];
        const properties = await Property.find({ status: 'for-sale' }).lean();
        return JSON.parse(JSON.stringify(properties));
    } catch (error) {
        console.warn('Failed to fetch properties for map:', error);
        return [];
    }
}

export default async function MapPage({ params }: { params: { locale: string } }) {
    const properties = await getAllProperties();
    const t = await getTranslations({ locale: params.locale, namespace: 'Index' });

    return (
        <div className="relative w-full h-[calc(100vh-80px)] bg-slate-50 overflow-hidden">
            {/* Header Overlay */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-slate-200 text-navy-900 font-bold uppercase tracking-widest text-xs pointer-events-auto hover:bg-champagne-50 hover:text-champagne-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </Link>
            </div>

            <div className="absolute top-6 right-6 z-10 hidden md:block">
                <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-slate-200 pointer-events-auto">
                    <h1 className="font-playfair text-xl font-bold text-navy-900 mb-1">{t('locations.mapTitle', { fallback: 'Interactive Map' })}</h1>
                    <p className="text-sm font-outfit text-slate-500 font-medium">{properties.length} Properties Available</p>
                </div>
            </div>

            <PropertyMap
                properties={properties}
                className="h-full w-full rounded-none border-none"
            />
        </div>
    );
}
