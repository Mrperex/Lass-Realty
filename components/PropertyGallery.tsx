'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Grid, Image as ImageIcon, Play } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import VideoPlayer from './VideoPlayer';

interface MediaItem {
    url: string;
    type: 'image' | 'video';
    poster?: string;
}

export default function PropertyGallery({ images, videos, title }: { 
    images: string[]; 
    videos?: string[];
    title: string 
}) {
    // Combine images and videos into a single array
    const mediaItems: MediaItem[] = [
        ...images.filter(url => url && url.trim() !== '').map(url => ({ url, type: 'image' as const })),
        ...(videos || []).filter(url => url && url.trim() !== '').map(url => ({ url, type: 'video' as const }))
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [mobileIndex, setMobileIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!isFullScreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
            } else if (e.key === 'ArrowLeft') {
                setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
            } else if (e.key === 'Escape') {
                setIsFullScreen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullScreen, mediaItems.length]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isFullScreen]);

    // Scroll handler for mobile carousel to keep track of X / Total
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!scrollContainerRef.current) return;
        const target = e.currentTarget;
        const index = Math.round(target.scrollLeft / target.clientWidth);
        setMobileIndex(index);
    };

    const nextImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    };

    if (!mounted || !images || images.length === 0) {
        return (
            <div className="w-full h-[50vh] flex items-center justify-center text-slate-400 text-lg bg-slate-800 rounded-b-3xl">
                No Image Available
            </div>
        );
    }

    return (
        <div className="relative w-full font-montserrat select-none">

            {/* ======================= */}
            {/* 1. MOBILE SNAP CAROUSEL */}
            {/* ======================= */}
            <div className="md:hidden relative w-full h-[50vh] sm:h-[60vh] bg-slate-900 rounded-b-3xl overflow-hidden group">
                {/* Mobile Carousel */}
                <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">
                    {mediaItems.map((item, idx) => {
                        if (!item || !item.url) return null;
                        return (
                            <div
                                key={`mob-${idx}`}
                                className="w-full h-full shrink-0 snap-center relative cursor-pointer"
                                onClick={() => { 
                                    trackEvent('gallery_open', { property_name: title, media_index: idx, media_type: item.type });
                                    setCurrentIndex(idx); 
                                    setIsFullScreen(true); 
                                }}
                            >
                            {item.type === 'image' ? (
                                <Image
                                    src={item.url}
                                    alt={`${title} - Image ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0}
                                />
                            ) : (
                                <>
                                    <VideoPlayer
                                        src={item.url}
                                        poster={item.poster}
                                        className="w-full h-full"
                                        muted={false}
                                        controls={true}
                                    />
                                    {/* Video overlay indicator */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        </div>
                                    </>
                                )}
                                {/* Gentle gradient to make the overlay text readable */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Floating Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg flex items-center gap-1.5 animate-in fade-in duration-300">
                    {mediaItems[currentIndex]?.type === 'video' ? (
                        <Play className="w-3.5 h-3.5" />
                    ) : (
                        <ImageIcon className="w-3.5 h-3.5" />
                    )}
                    {mobileIndex + 1} / {mediaItems.length}
                </div>
            </div>

            {/* =================================== */}
            {/* 2. DESKTOP ASYMMETRICAL MOSAIC GRID */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 h-[60vh] lg:h-[75vh] gap-3 p-3 relative rounded-b-3xl overflow-hidden bg-white/50 group">

                {/* Hero / Left Item with subtle Ken Burns effect */}
                {mediaItems[0] && (
                    <div
                        className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl cursor-pointer shadow-sm"
                        onClick={() => { 
                            trackEvent('gallery_open', { property_name: title, media_index: 0, media_type: mediaItems[0].type });
                            setCurrentIndex(0); 
                            setIsFullScreen(true); 
                        }}
                    >
                        {mediaItems[0].type === 'image' ? (
                            <>
                                <Image
                                    src={mediaItems[0].url}
                                    alt={`${title} - Main Hero`}
                                    fill
                                    className="object-cover transition-transform duration-[15000ms] ease-out scale-[1.03] group-hover:scale-100"
                                    priority
                                    sizes="(max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-navy-900/0 hover:bg-navy-900/10 transition-colors duration-300"></div>
                            </>
                        ) : (
                            <>
                                <VideoPlayer
                                    src={mediaItems[0].url}
                                    poster={mediaItems[0].poster}
                                    className="w-full h-full"
                                    muted={false}
                                    controls={true}
                                />
                                <div className="absolute inset-0 bg-navy-900/0 hover:bg-navy-900/10 transition-colors duration-300 flex items-center justify-center">
                                    <div className="bg-white/90 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-8 h-8 text-navy-900 ml-1" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Supporting Items */}
                {mediaItems.slice(1, 5).map((item, idx) => {
                    const actualIndex = idx + 1;
                    const isLast = idx === 3 && mediaItems.length > 5;
                    if (!item || !item.url) return null;
                    return (
                        <div
                            key={`desk-${idx}`}
                            className="relative overflow-hidden rounded-2xl cursor-pointer col-span-1 row-span-1 shadow-sm"
                            onClick={() => { 
                                trackEvent('gallery_open', { property_name: title, media_index: actualIndex, media_type: item.type });
                                setCurrentIndex(actualIndex); 
                                setIsFullScreen(true); 
                            }}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    src={item.url}
                                    alt={`${title} - Supporting ${actualIndex + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-110"
                                    sizes="(max-width: 1200px) 25vw, 16vw"
                                />
                            ) : (
                                <>
                                    <VideoPlayer
                                        src={item.url}
                                        poster={item.poster}
                                        className="w-full h-full"
                                        muted={false}
                                        controls={true}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/50 rounded-full p-2">
                                            <Play className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>

                            {/* Overlay for "Remaining Items" */}
                            {isLast && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center transition-colors hover:bg-black/40">
                                    <span className="text-white font-playfair font-medium tracking-tight text-3xl">+{mediaItems.length - 5}</span>
                                    <span className="text-white/80 font-bold uppercase tracking-widest text-xs mt-1">
                                        {mediaItems.slice(5).some(i => i.type === 'video') ? 'Media' : 'Photos'}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Desktop "View All" Pill */}
                {images.length > 0 && (
                    <button
                        onClick={() => { 
                            trackEvent('gallery_open', { property_name: title, photo_index: 0 });
                            setCurrentIndex(0); 
                            setIsFullScreen(true); 
                        }}
                        className="absolute bottom-8 right-8 flex items-center gap-2 bg-white/95 backdrop-blur-md text-navy-900 px-5 py-3 rounded-full font-bold shadow-xl hover:bg-slate-50 transition-all hover:-translate-y-1 z-10 text-xs tracking-wider uppercase"
                    >
                        <Grid className="w-4 h-4" />
                        Explore Gallery
                    </button>
                )}
            </div>

            {/* ===================================== */}
            {/* 3. FULLSCREEN ADVANCED LIGHTBOX MODAL */}
            {/* ===================================== */}
            {isFullScreen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col animate-in fade-in zoom-in-95 duration-200">

                    {/* Lightbox Header Bar */}
                    <div className="flex items-center justify-between px-6 py-4 text-white/80 z-20">
                        <div className="text-sm font-semibold tracking-widest uppercase flex items-center gap-2">
                            {mediaItems[currentIndex]?.type === 'video' ? (
                                <Play className="w-4 h-4 text-champagne-500" />
                            ) : (
                                <ImageIcon className="w-4 h-4 text-champagne-500" />
                            )}
                            {currentIndex + 1} <span className="text-white/40">/</span> {mediaItems.length}
                        </div>
                        <button
                            onClick={() => setIsFullScreen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                            aria-label="Close Gallery"
                        >
                            <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Main Media Viewport Area */}
                    <div
                        className="flex-1 relative flex items-center justify-center w-full h-full pb-[100px] md:pb-[140px]"
                        onClick={() => setIsFullScreen(false)}
                    >
                        {mediaItems[currentIndex]?.type === 'image' ? (
                            <Image
                                src={mediaItems[currentIndex].url}
                                alt={`${title} - Fullscreen ${currentIndex + 1}`}
                                fill
                                className="object-contain px-2 md:px-12 pb-4"
                                sizes="100vw"
                                priority
                                quality={100}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <VideoPlayer
                                src={mediaItems[currentIndex].url}
                                poster={mediaItems[currentIndex].poster}
                                className="w-full h-full max-w-7xl mx-auto px-2 md:px-12 pb-4"
                                title={`${title} - Video ${currentIndex + 1}`}
                                controls={true}
                                autoPlay={false}
                                muted={false}
                            />
                        )}

                        {/* Navigation Chevrons (Centered) */}
                        {mediaItems.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 md:left-8 p-3 md:p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-md shadow-2xl -translate-y-1/2 top-1/2"
                                >
                                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 md:right-8 p-3 md:p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-md shadow-2xl -translate-y-1/2 top-1/2"
                                >
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Bottom Thumbnail Navigation Strip */}
                    <div className="absolute bottom-0 left-0 right-0 h-[100px] md:h-[130px] bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-start px-2 md:px-6 pb-4 md:pb-6 overflow-x-auto scrollbar-hide z-30">
                        <div className="flex items-center gap-2 px-2 pb-2">
                            {mediaItems.map((item, idx) => {
                                if (!item || !item.url) return null;
                                return (
                                    <button
                                        key={`thumb-${idx}`}
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                        className={`relative h-14 md:h-20 shrink-0 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${currentIndex === idx
                                                ? 'w-20 md:w-28 ring-2 ring-champagne-500 scale-105 opacity-100 z-10'
                                                : 'w-14 md:w-20 opacity-40 hover:opacity-100 hover:w-16 md:hover:w-24'
                                            }`}
                                    >
                                        {item.type === 'image' ? (
                                            <Image
                                                src={item.url}
                                                alt={`Thumbnail ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="120px"
                                            />
                                        ) : (
                                            <>
                                                {item.poster ? (
                                                    <Image
                                                        src={item.poster}
                                                        alt={`Video Thumbnail ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="120px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-800" />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Play className="w-4 h-4 text-white drop-shadow-lg" />
                                                </div>
                                            </>
                                        )}
                                        {/* Dark overlay for unselected text */}
                                        {currentIndex !== idx && (
                                            <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
