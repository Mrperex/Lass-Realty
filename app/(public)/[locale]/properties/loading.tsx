import { MapPin, Bed, Bath, Maximize } from 'lucide-react';

export default function PropertiesLoading() {
    return (
        <div className="py-16 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-12 animate-pulse">
                    <div className="h-10 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                </div>

                {/* Filters Skeleton */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="h-12 bg-slate-100 rounded-xl"></div>
                        <div className="h-12 bg-slate-100 rounded-xl hidden md:block"></div>
                        <div className="h-12 bg-slate-100 rounded-xl hidden md:block"></div>
                        <div className="h-12 bg-slate-200 rounded-xl"></div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                            {/* Image Placeholder */}
                            <div className="relative aspect-[4/3] bg-slate-200">
                                {/* Price Tag */}
                                <div className="absolute top-4 left-4 bg-white/50 w-24 h-8 rounded-full"></div>
                                {/* Status Tag */}
                                <div className="absolute top-4 right-4 bg-white/50 w-20 h-8 rounded-full"></div>
                            </div>
                            
                            <div className="p-6">
                                {/* Title */}
                                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                                {/* Location */}
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-slate-300" />
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                </div>
                                
                                <div className="border-t border-slate-100 pt-4 mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <Bed className="w-4 h-4 text-slate-300" />
                                                <div className="w-4 h-4 bg-slate-100 rounded"></div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bath className="w-4 h-4 text-slate-300" />
                                                <div className="w-4 h-4 bg-slate-100 rounded"></div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Maximize className="w-4 h-4 text-slate-300" />
                                                <div className="w-8 h-4 bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
