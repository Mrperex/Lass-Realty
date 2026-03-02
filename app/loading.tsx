export default function Loading() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-24 h-24">
                    {/* Inner glowing core */}
                    <div className="absolute inset-0 bg-amber-400 rounded-full animate-pulse opacity-50 blur-xl"></div>

                    {/* Spinning ring 1 */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-amber-600 rounded-full animate-spin"></div>

                    {/* Spinning ring 2 (slower, opposite direction) */}
                    <div className="absolute inset-2 border-4 border-transparent border-l-slate-900 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>

                    {/* Center dots */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce"></div>
                    </div>
                </div>

                <p className="text-slate-600 font-bold uppercase tracking-widest text-sm animate-pulse">
                    Loading Experience...
                </p>
            </div>
        </div>
    );
}
