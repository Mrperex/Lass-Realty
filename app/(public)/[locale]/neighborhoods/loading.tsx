export default function NeighborhoodsLoading() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="max-w-3xl mb-16 animate-pulse">
                    <div className="h-12 bg-slate-200 rounded w-2/3 mb-6"></div>
                    <div className="h-6 bg-slate-200 rounded w-full max-w-lg"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="group bg-white flex flex-col h-full shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                            {/* Hero Image Skeleton */}
                            <div className="relative aspect-[16/10] bg-slate-200">
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-300 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 h-8 bg-slate-300 rounded w-1/2"></div>
                            </div>

                            {/* Content Skeleton */}
                            <div className="p-6 flex flex-col flex-1">
                                {/* Average Price */}
                                <div className="h-5 bg-slate-100 rounded w-1/3 mb-4"></div>

                                {/* Description Lines */}
                                <div className="space-y-2 mb-6 flex-1">
                                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                </div>

                                {/* Highlights Pills */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    <div className="h-6 bg-slate-100 rounded w-16 px-3"></div>
                                    <div className="h-6 bg-slate-100 rounded w-20 px-3"></div>
                                    <div className="h-6 bg-slate-100 rounded w-24 px-3"></div>
                                </div>

                                {/* Explore Link */}
                                <div className="h-5 bg-slate-200 rounded w-1/3 mt-auto"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
