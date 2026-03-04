import PropertyGrid from '@/components/PropertyGrid';
import { Link } from '@/navigation';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import SearchFilters from '@/components/SearchFilters';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60; // Revalidate every minute

async function getProperties(searchParams: { [key: string]: string | string[] | undefined }) {
    try {
        await connectToDatabase();
        if (!mongoose.connection.readyState) return [];

        const query: any = {};

        if (searchParams.city && typeof searchParams.city === 'string') {
            query.citySlug = searchParams.city;
        }

        if (searchParams.beds && typeof searchParams.beds === 'string') {
            const bedCount = Number(searchParams.beds);
            if (!isNaN(bedCount)) {
                if (bedCount >= 4) {
                    query.bedrooms = { $gte: 4 }; // 4+ beds
                } else {
                    query.bedrooms = bedCount;
                }
            }
        }

        if (searchParams.minPrice || searchParams.maxPrice) {
            query.price = {};
            if (searchParams.minPrice && !isNaN(Number(searchParams.minPrice))) {
                query.price.$gte = Number(searchParams.minPrice);
            }
            if (searchParams.maxPrice && !isNaN(Number(searchParams.maxPrice))) {
                query.price.$lte = Number(searchParams.maxPrice);
            }
        }

        if (searchParams.amenities && typeof searchParams.amenities === 'string') {
            const amenitiesList = searchParams.amenities.split(',').filter(Boolean);
            if (amenitiesList.length > 0) {
                query.amenities = { $all: amenitiesList };
            }
        }

        let sortQuery: any = { createdAt: -1 };

        if (searchParams.sort && typeof searchParams.sort === 'string') {
            switch (searchParams.sort) {
                case 'price-asc':
                    sortQuery = { price: 1, createdAt: -1 };
                    break;
                case 'price-desc':
                    sortQuery = { price: -1, createdAt: -1 };
                    break;
                case 'popular':
                    sortQuery = { featured: -1, createdAt: -1 };
                    break;
                case 'newest':
                default:
                    sortQuery = { createdAt: -1 };
                    break;
            }
        }

        const properties = await Property.find(query).sort(sortQuery).lean();
        return JSON.parse(JSON.stringify(properties));
    } catch (error: any) {
        if (error && error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
        console.warn('Failed to fetch properties:', error);
        return [];
    }
}

export default async function PropertiesPage({ searchParams, params }: { searchParams: { [key: string]: string | string[] | undefined }, params: { locale: string } }) {
    const properties = await getProperties(searchParams);
    const t = await getTranslations({ locale: params.locale, namespace: 'PropertiesList' });

    return (
        <div className="py-16 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">{t('title')}</h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        {t('description')}
                    </p>
                </div>

                <SearchFilters />

                {properties.length > 0 ? (
                    <PropertyGrid properties={properties} />
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('noProperties')}</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            {t('noPropertiesDesc')}
                        </p>
                        <Link
                            href="/properties"
                            className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
                        >
                            {t('resetFilters')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
