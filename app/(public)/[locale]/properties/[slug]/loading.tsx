import { MapPin, Bed, Bath } from 'lucide-react';

export default function PropertyDetailLoading() {
    return (
        <div className="bg-slate-50 min-h-screen pb-24 animate-pulse">
            {/* Gallery Skeleton */}
            <div className="w-full relative bg-slate-900 aspect-[21/9] md:aspect-[24/9]">
                <div className="absolute inset-0 bg-slate-800"></div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-16 h-12 bg-slate-700 rounded-lg"></div>
                    <div className="w-16 h-12 bg-slate-700 rounded-lg hidden sm:block"></div>
                    <div className="w-16 h-12 bg-slate-700 rounded-lg hidden sm:block"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-12 border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Breadcrumbs */}
                            <div className="h-4 bg-slate-100 rounded w-48 mb-8"></div>
                            
                            <div>
                                <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-4">
                                    <div className="flex-1 w-full">
                                        {/* Title */}
                                        <div className="h-12 bg-slate-200 rounded w-full mb-2"></div>
                                        <div className="h-12 bg-slate-200 rounded w-3/4"></div>
                                    </div>
                                    <div className="flex flex-col items-start lg:items-end gap-3 shrink-0 w-full lg:w-auto">
                                        {/* Price */}
                                        <div className="h-12 bg-slate-200 rounded-2xl w-48"></div>
                                        {/* Action buttons */}
                                        <div className="flex gap-2 w-full lg:w-auto mt-2">
                                            <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
                                            <div className="h-10 bg-slate-200 rounded-xl w-10"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-2 mt-4">
                                    <MapPin className="w-5 h-5 text-slate-300" />
                                    <div className="h-6 bg-slate-100 rounded w-48"></div>
                                </div>
                                
                                {/* Badges */}
                                <div className="flex gap-2 mt-4">
                                    <div className="h-8 bg-slate-100 rounded-full w-24"></div>
                                    <div className="h-8 bg-slate-100 rounded-full w-32"></div>
                                </div>
                            </div>

                            {/* Key Features */}
                            <div className="flex items-center gap-8 py-8 border-y border-slate-100 mt-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                                        <Bed className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <div>
                                        <div className="h-3 bg-slate-100 rounded w-16 mb-2"></div>
                                        <div className="h-6 bg-slate-200 rounded w-8"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                                        <Bath className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <div>
                                        <div className="h-3 bg-slate-100 rounded w-16 mb-2"></div>
                                        <div className="h-6 bg-slate-200 rounded w-8"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Description lines */}
                            <div className="space-y-3 mt-8">
                                <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                <div className="h-4 bg-slate-100 rounded w-4/5"></div>
                            </div>
                        </div>

                        {/* Sidebar / Contact */}
                        <div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 xl:sticky xl:top-28">
                                <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
                                <div className="space-y-4">
                                    <div className="h-12 bg-white rounded-xl"></div>
                                    <div className="h-12 bg-white rounded-xl"></div>
                                    <div className="h-12 bg-white rounded-xl"></div>
                                    <div className="h-24 bg-white rounded-xl"></div>
                                    <div className="h-12 bg-slate-300 rounded-xl mt-6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
