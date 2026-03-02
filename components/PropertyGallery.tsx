'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export default function PropertyGallery({ images, title }: { images: string[]; title: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[50vh] flex items-center justify-center text-slate-400 text-lg bg-slate-800 rounded-b-3xl">
                No Image Available
            </div>
        );
    }

    const nextImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <>
            {/* Standard Inline Grid View for 3+ Images */}
            {images.length >= 3 && !isFullScreen ? (
                <div className="grid gap-2 p-2 grid-cols-2 md:grid-cols-4 md:grid-rows-2 h-[60vh] md:h-[70vh] relative group cursor-pointer" onClick={() => setIsFullScreen(true)}>
                    {images.slice(0, 5).map((img, idx) => (
                        <div key={idx} className={`relative overflow-hidden rounded-xl ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
                            <Image
                                src={img}
                                alt={`${title} - Image ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                priority={idx === 0}
                            />
                            {idx === 4 && images.length > 5 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">+{images.length - 5} More</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-slate-900/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                    ))}

                    {/* View All Button Overlay */}
                    <div className="absolute bottom-6 right-6 z-10">
                        <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-white transition-colors">
                            <Maximize2 className="w-4 h-4" />
                            View All {images.length} Photos
                        </button>
                    </div>
                </div>
            ) : (
                /* Standard Single/Dual Image View */
                !isFullScreen && (
                    <div className="relative w-full h-[50vh] md:h-[70vh] group">
                        <Image
                            src={images[0]}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {images.length > 1 && (
                            <button
                                onClick={() => setIsFullScreen(true)}
                                className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-white transition-colors z-10"
                            >
                                <Maximize2 className="w-4 h-4" />
                                View All {images.length} Photos
                            </button>
                        )}
                    </div>
                )
            )}

            {/* Fullscreen Modal Slider */}
            {isFullScreen && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 md:p-6 text-white absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="text-sm font-medium tracking-wide">
                            {currentIndex + 1} / {images.length}
                        </div>
                        <button
                            onClick={() => setIsFullScreen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                    </div>

                    {/* Main Image Area */}
                    <div className="flex-1 relative flex items-center justify-center w-full h-full select-none" onClick={() => setIsFullScreen(false)}>
                        <Image
                            src={images[currentIndex]}
                            alt={`${title} - Fullscreen ${currentIndex + 1}`}
                            fill
                            className="object-contain p-4 md:p-12"
                            sizes="100vw"
                            priority
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 md:left-8 p-3 md:p-4 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm shadow-xl"
                                >
                                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 md:right-8 p-3 md:p-4 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm shadow-xl"
                                >
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
