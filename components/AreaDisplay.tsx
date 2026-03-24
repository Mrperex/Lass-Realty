'use client';

import { useState } from 'react';

interface AreaDisplayProps {
    squareMeters: number;
    price?: number;
    className?: string;
}

export default function AreaDisplay({ squareMeters, price, className = "flex items-center gap-2 lg:gap-3" }: AreaDisplayProps) {
    const [useSqFt, setUseSqFt] = useState(false);

    if (!squareMeters) return null;

    const area = useSqFt ? Math.round(squareMeters * 10.7639) : squareMeters;
    const unitPrice = price ? Math.round(price / area) : 0;

    return (
        <>
            <div className={`${className}`}>
                <span className="font-medium text-slate-500">
                    <span className="text-navy-900 font-bold">{area.toLocaleString()}</span> {useSqFt ? 'sq ft' : 'm²'}
                </span>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUseSqFt(!useSqFt);
                    }}
                    className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 p-2"
                    title="Toggle Square Meters / Square Feet"
                    aria-label={useSqFt ? 'Switch to square meters' : 'Switch to square feet'}
                >
                    <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${useSqFt ? 'bg-amber-500' : 'bg-slate-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useSqFt ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </span>
                </button>
            </div>

            {price && area > 0 && (
                <div className={`${className}`}>
                    <span className="font-medium text-slate-500">
                        <span className="text-navy-900 font-bold">${unitPrice.toLocaleString()}</span> / {useSqFt ? 'sq ft' : 'm²'}
                    </span>
                </div>
            )}
        </>
    );
}
