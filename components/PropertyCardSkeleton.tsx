export default function PropertyCardSkeleton() {
    return (
        <div className="group block overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 relative">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] bg-navy-900/5 animate-pulse overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-navy-900/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>

            {/* Content Placeholder */}
            <div className="p-6">
                {/* Title */}
                <div className="h-6 bg-navy-900/10 rounded-md w-3/4 mb-4 animate-pulse"></div>
                {/* Location */}
                <div className="h-4 bg-navy-900/5 rounded-md w-1/2 mb-6 animate-pulse"></div>

                {/* Footer specs */}
                <div className="flex items-center gap-6 border-t border-slate-100 pt-5">
                    <div className="h-4 bg-navy-900/5 rounded-md w-16 animate-pulse"></div>
                    <div className="h-4 bg-navy-900/5 rounded-md w-16 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
            ))}
        </div>
    );
}
