'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';

interface OptimizedPropertyImageProps {
    src: string;
    alt: string;
    priority?: boolean;
    className?: string;
    sizes?: string;
    width?: number;
    height?: number;
    fill?: boolean;
}

// Tiny SVG blur placeholder — no network request, instant render
const shimmerSvg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#e2e8f0"/><rect width="400" height="300" fill="url(#g)"/><defs><linearGradient id="g"><stop offset="20%" stop-color="#e2e8f0"/><stop offset="50%" stop-color="#f1f5f9"/><stop offset="80%" stop-color="#e2e8f0"/></linearGradient></defs></svg>`;
const blurDataURL = `data:image/svg+xml;base64,${typeof window === 'undefined' ? Buffer.from(shimmerSvg).toString('base64') : btoa(shimmerSvg)}`;

// Cloudinary loader — inserts transformations into existing URL
// Keeps version number + public ID intact so URLs never break
const cloudinaryLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    if (!src.includes('cloudinary.com')) return src;

    const transforms = `c_fill,g_auto,w_${width},q_auto:eco,f_webp`;

    // Insert transforms between /upload/ and the version/public-id
    return src.replace('/upload/', `/upload/${transforms}/`);
};

export default function OptimizedPropertyImage({
    src,
    alt,
    priority = false,
    className = '',
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    width,
    height,
    fill = true,
}: OptimizedPropertyImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = useCallback(() => setIsLoading(false), []);
    const handleError = useCallback(() => {
        setHasError(true);
        setIsLoading(false);
    }, []);

    if (hasError) {
        return (
            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-xs">Image not available</span>
            </div>
        );
    }

    // Use the raw Cloudinary URL directly — let the loader handle optimization
    const imageSrc = src;

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse z-[1]" />
            )}
            <Image
                loader={src.includes('cloudinary.com') ? cloudinaryLoader : undefined}
                src={imageSrc}
                alt={alt}
                fill={fill}
                width={fill ? undefined : (width || 800)}
                height={fill ? undefined : (height || 600)}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
                priority={priority}
                sizes={sizes}
                placeholder="blur"
                blurDataURL={blurDataURL}
                onLoad={handleLoad}
                onError={handleError}
                style={{ objectFit: 'cover' }}
                quality={60}
            />
        </>
    );
}
