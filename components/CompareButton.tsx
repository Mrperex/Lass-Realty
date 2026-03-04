'use client';

import { useCompareStore } from '@/store/compareStore';
import { IProperty } from '@/types/property';
import { Scale } from 'lucide-react';

export default function CompareButton({ property }: { property: IProperty }) {
    const { compareList, addCompare, removeCompare, openDock } = useCompareStore();

    const isComparing = compareList.some(p => p._id === property._id);

    const toggleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isComparing) {
            removeCompare(property._id as string);
        } else {
            // The store logic will now naturally handle capping it at 3 
            // and auto-opening the global Dock UI.
            addCompare(property);
            openDock();
        }
    };

    return (
        <button
            onClick={toggleCompare}
            className={`p-3 md:p-2 rounded-full transition-all duration-300 shadow-md backdrop-blur-md border flex items-center justify-center min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 ${isComparing
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
