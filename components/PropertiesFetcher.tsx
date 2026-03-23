'use client';

import { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import { IProperty } from '@/types/property';
import { useSearchParams } from 'next/navigation';

interface PropertiesFetcherProps {
    initialProperties: IProperty[];
    locale: string;
}

export default function PropertiesFetcher({ initialProperties, locale }: PropertiesFetcherProps) {
    const [properties, setProperties] = useState<IProperty[]>(initialProperties);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const searchParams = useSearchParams();

    useEffect(() => {
        // If we have initial properties and they're not empty, no need to fetch
        if (initialProperties && initialProperties.length > 0) {
            return;
        }

        // If initial properties are empty, try to fetch on client
        fetchProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    const fetchProperties = async (isRetry = false) => {
        if (isLoading && !isRetry) return;

        setIsLoading(true);
        setError(null);

        try {
            // Build query string
            const params = new URLSearchParams();
            searchParams.forEach((value, key) => {
                params.append(key, value);
            });

            const response = await fetch(`/api/properties?${params.toString()}`, {
                headers: {
                    'Accept-Language': locale,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.properties) {
                setProperties(data.properties);
                setRetryCount(0);
            } else {
                throw new Error(data.error || 'Invalid response');
            }
        } catch (err) {
            console.error('Client-side fetch failed:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            
            // Auto-retry up to 3 times with exponential backoff
            if (retryCount < 3) {
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    fetchProperties(true);
                }, delay);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setRetryCount(0);
        fetchProperties(true);
    };

    // Show skeleton while loading or retrying
    if (isLoading || (retryCount > 0 && retryCount <= 3)) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <PropertyCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Show error state with retry button
    if (error && retryCount >= 3) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Properties</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                    {error}. Please check your connection and try again.
                </p>
                <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Show properties if we have them
    if (properties && properties.length > 0) {
        return <PropertyGrid properties={properties} />;
    }

    // Show empty state if no properties
    return (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Properties Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
                Check back later for new listings.
            </p>
            <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
            >
                Refresh
            </button>
        </div>
    );
}
