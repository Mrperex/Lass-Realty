import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import Link from 'next/link';
import { Plus, Home, MapPin } from 'lucide-react';
import PropertyRowActions from './PropertyRowActions';

export const revalidate = 0;

export default async function AdminPropertiesPage() {
    await connectToDatabase();

    const properties = await Property.find().sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Property Management</h1>
                    <p className="text-slate-500 mt-2">Add, edit, and organize your real estate portfolio.</p>
                </div>
                <Link
                    href="/admin/properties/new"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Property
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {properties.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {properties.map((property: any) => (
                                    <tr key={property._id.toString()} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                    <img src={property.images[0]} alt={property.title} className="object-cover w-full h-full" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{property.title}</span>
                                                    <span className="text-xs text-slate-500 truncate max-w-[200px]">/{property.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                {property.city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-emerald-600">
                                                ${property.price?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {property.featured ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    Standard
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <PropertyRowActions propertyId={property._id.toString()} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Home className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Properties Yet</h3>
                        <p className="text-slate-500 max-w-sm mb-6">Your portfolio is currently empty. Start adding properties to display them to potential clients.</p>
                        <Link href="/admin/properties/new" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-sm">
                            <Plus className="w-5 h-5" />
                            Add First Property
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
