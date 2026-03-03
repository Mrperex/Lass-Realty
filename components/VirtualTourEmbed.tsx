import { Maximize, PlayCircle } from 'lucide-react';

export default function VirtualTourEmbed({ url }: { url: string }) {
    if (!url) return null;

    return (
        <div className="mt-12 pt-12 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl md:text-3xl font-medium text-navy-900 flex items-center gap-3">
                    <PlayCircle className="w-8 h-8 text-champagne-500" />
                    3D Virtual Tour
                </h2>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-champagne-600 hover:text-champagne-500 transition-colors bg-champagne-500/10 px-4 py-2 rounded-lg"
                >
                    <Maximize className="w-4 h-4" />
                    Full Screen
                </a>
            </div>

            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-slate-900 group">
                {/* Loader Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-0">
                    <div className="w-12 h-12 border-4 border-slate-800 border-t-champagne-500 rounded-full animate-spin"></div>
                </div>

                <iframe
                    src={url}
                    className="absolute inset-0 w-full h-full z-10"
                    frameBorder="0"
                    allowFullScreen
                    allow="xr-spatial-tracking"
                ></iframe>
            </div>

            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden mt-4 w-full flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase text-champagne-600 hover:text-champagne-500 transition-colors bg-champagne-500/10 px-4 py-3 rounded-xl"
            >
                <Maximize className="w-4 h-4" />
                Open Full Screen
            </a>
        </div>
    );
}
