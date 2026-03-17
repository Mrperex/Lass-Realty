export default function BlogLoading() {
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
                        <div key={i} className="group bg-white flex flex-col h-full shadow-sm border border-gray-100 transition-shadow duration-300 animate-pulse">
                            {/* Cover Image Skeleton */}
                            <div className="relative aspect-[16/9] bg-slate-200 overflow-hidden">
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 h-6 w-24 bg-slate-300 rounded"></div>
                            </div>

                            {/* Content Skeleton */}
                            <div className="p-6 flex flex-col flex-1">
                                {/* Meta data (Date/Author) */}
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-4 bg-slate-100 rounded w-24"></div>
                                    <div className="h-4 bg-slate-100 rounded w-20"></div>
                                </div>

                                {/* Title */}
                                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>

                                {/* Excerpt */}
                                <div className="space-y-2 mb-6 flex-1">
                                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                                </div>

                                {/* Read Article Link */}
                                <div className="h-4 bg-slate-200 rounded w-32 mt-auto"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
