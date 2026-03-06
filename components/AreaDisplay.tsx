'use client';

import { useState } from 'react';

interface AreaDisplayProps {
    squareMeters: number;
    className?: string;
}

export default function AreaDisplay({ squareMeters, className = "flex items-center gap-2 lg:gap-3" }: AreaDisplayProps) {
    const [useSqFt, setUseSqFt] = useState(false);

    if (!squareMeters) return null;

    const area = useSqFt ? Math.round(squareMeters * 10.7639) : squareMeters;

    return (
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
                className={`relative inline-flex h-4 w-7 lg:h-5 lg:w-9 items-center rounded-full transition-colors focus:outline-none ml-1 ${useSqFt ? 'bg-amber-500' : 'bg-slate-300'}`}
                title="Toggle Square Meters / Square Feet"
            >
                <span className={`inline-block h-3 w-3 lg:h-4 lg:w-4 transform rounded-full bg-white transition-transform ${useSqFt ? 'translate-x-3.5 lg:translate-x-4' : 'translate-x-0.5'}`} />
            </button>
        </div>
    );
}
