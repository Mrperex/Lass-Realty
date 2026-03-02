'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [city, setCity] = useState(searchParams.get('city') || '');
    const [beds, setBeds] = useState(searchParams.get('beds') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (beds) params.set('beds', beds);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);

        router.push(`/properties?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="bg-white p-4 md:p-6 mb-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                    <option value="">All Locations</option>
                    <option value="punta-cana">Punta Cana</option>
                    <option value="cap-cana">Cap Cana</option>
                    <option value="bavaro">Bavaro</option>
                    <option value="macao">Macao</option>
                </select>
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                <select value={beds} onChange={e => setBeds(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                    <option value="">Any Beds</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4+ Beds</option>
                </select>
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">Min Price</label>
                <input type="number" placeholder="No Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" min="0" step="1000" />
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Price</label>
                <input type="number" placeholder="No Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" min="0" step="1000" />
            </div>
            <button type="submit" className="w-full md:w-[120px] shrink-0 h-[42px] bg-slate-900 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Find
            </button>
        </form>
    );
}
