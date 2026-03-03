'use client';

import { useState } from 'react';
import { IProperty } from '@/types/property';
import PropertyGrid from './PropertyGrid';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet
const PropertyMap = dynamic(() => import('./PropertyMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full rounded-3xl bg-slate-100 animate-pulse border border-slate-200 flex items-center justify-center">
            <MapIcon className="w-12 h-12 text-slate-300" />
        </div>
    )
});

export default function PropertiesView({ properties }: { properties: IProperty[] }) {
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    return (
        <div className="w-full font-outfit">
            {/* View Toggle Bar */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-slate-500 font-medium">
                    Showing <span className="font-bold text-navy-900">{properties.length}</span> luxury properties
                </div>

                <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-200 flex gap-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'}`}
                    >
                        <MapIcon className="w-4 h-4" />
                        Map
                    </button>
                </div>
            </div>

            {/* Display Mode */}
            {viewMode === 'grid' ? (
                <PropertyGrid properties={properties} />
            ) : (
                <PropertyMap properties={properties} />
            )}
        </div>
    );
}
