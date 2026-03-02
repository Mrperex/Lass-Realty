import { IProperty } from '@/types/property';
import PropertyCard from './PropertyCard';

export default function PropertyGrid({ properties }: { properties: IProperty[] }) {
    if (!properties || properties.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <h3 className="text-lg font-medium text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-500">Check back later for new listings.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
                <PropertyCard key={property._id?.toString() || property.slug} property={property} />
            ))}
        </div>
    );
}
