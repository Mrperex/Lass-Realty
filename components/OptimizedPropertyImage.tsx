import Image from 'next/image';
import { useState } from 'react';

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

// Optimized blur placeholder for property images
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

export default function OptimizedPropertyImage({
    src,
    alt,
    priority = false,
    className = "",
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    width,
    height,
    fill = false
}: OptimizedPropertyImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // Generate Cloudinary optimized URL if it's a Cloudinary image
    const getOptimizedUrl = (url: string, w?: number, h?: number) => {
        if (!url.includes('cloudinary.com')) return url;
        
        const transformations = [
            'c_fill',
            'g_auto',
            'q_auto:best',
            'f_auto',
            w && `w_${w}`,
            h && `h_${h}`
        ].filter(Boolean).join(',');
        
        const publicId = url.split('/').pop()?.split('.')[0];
        return `https://res.cloudinary.com/dsriyqmoy/image/upload/${transformations}/${publicId}`;
    };

    const handleError = () => {
        setError(true);
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    if (error) {
        return (
            <div className={`bg-slate-200 flex items-center justify-center ${className}`}>
                <span className="text-slate-500 text-sm">Image not available</span>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
            )}
            
            <Image
                src={getOptimizedUrl(src, width, height)}
                alt={alt}
                fill={fill}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
                priority={priority}
                sizes={sizes}
                placeholder="blur"
                blurDataURL={blurDataURL}
                onError={handleError}
                onLoad={handleLoad}
                style={{
                    objectFit: 'cover'
                }}
            />
        </div>
    );
}
