import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import Lead from '@/models/Lead';
import Link from 'next/link';
import { Home, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 0; // Don't cache admin dashboard

export default async function AdminDashboard() {
    await connectToDatabase();

    // Fetch high-level stats
    const propertyCount = await Property.countDocuments();
    const featuredProperties = await Property.countDocuments({ featured: true });
    const leadCount = await Lead.countDocuments();

    // Fetch recent activity
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentProperties = await Property.find().sort({ createdAt: -1 }).limit(5).select('title city price createdAt').lean();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back. Here is what is happening with your portfolio today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Properties</p>
                        <h3 className="text-3xl font-bold text-slate-900">{propertyCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Home className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Leads</p>
                        <h3 className="text-3xl font-bold text-slate-900">{leadCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Featured</p>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">&quot;Waiting for the market&quot; is not a strategy.</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Activity Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Recent Leads */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">Recent Inquiries</h3>
                        <Link href="/admin/leads" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 flex-1">
                        {recentLeads.length > 0 ? (
                            recentLeads.map((lead: any) => (
                                <div key={lead._id.toString()} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-semibold text-slate-900">{lead.name}</p>
                                        <span className="text-xs text-slate-500">
                                            {lead.createdAt ? format(new Date(lead.createdAt), 'MMM d, yyyy') : 'Recent'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2 truncate">{lead.email} • {lead.phone}</p>
                                    <p className="text-sm text-slate-500 line-clamp-2 italic">&quot;{lead.message}&quot;</p>
                                    {lead.propertySlug && (
                                        <div className="mt-3 inline-flex px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">
                                            Int: {lead.propertySlug}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500">No recent inquiries found.</div>
                        )}
                    </div>
                </div>

                {/* Recent Properties */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">Recently Added</h3>
                        <Link href="/admin/properties" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                            Manage Catalog <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 flex-1">
                        {recentProperties.length > 0 ? (
                            recentProperties.map((property: any) => (
                                <div key={property._id.toString()} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-1 truncate max-w-[200px] sm:max-w-xs">{property.title}</h4>
                                        <p className="text-sm text-slate-500">{property.city}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-600">${property.price?.toLocaleString() || 'N/A'}</p>
                                        <span className="text-xs text-slate-400 block mt-1">
                                            {property.createdAt ? format(new Date(property.createdAt), 'MMM d') : 'New'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500">No properties found.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
