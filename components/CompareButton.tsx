'use client';

import { useCompareStore } from '@/store/compareStore';
import { IProperty } from '@/types/property';
import { Scale } from 'lucide-react';

export default function CompareButton({ property }: { property: IProperty }) {
    const { compareList, addCompare, removeCompare } = useCompareStore();

    const isComparing = compareList.some(p => p._id === property._id);
    const isFull = compareList.length >= 2;

    const toggleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isComparing) {
            removeCompare(property._id as string);
        } else {
            if (!isFull) {
                addCompare(property);
            } else {
                alert("You can only compare 2 properties at a time. Please remove one first.");
            }
        }
    };

    return (
        <button
            onClick={toggleCompare}
            className={`p-2 rounded-full transition-all duration-300 shadow-md backdrop-blur-md border ${isComparing
                    ? 'bg-champagne-500 text-navy-900 border-champagne-400'
                    : 'bg-navy-900/40 text-white border-white/20 hover:bg-navy-900/60'
                }`}
            title={isComparing ? "Remove from compare" : "Compare property"}
            aria-label="Compare property"
        >
            <Scale className={`w-5 h-5 ${isComparing ? 'fill-current' : ''}`} />
        </button>
    );
}
