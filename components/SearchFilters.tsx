'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('SearchFilters');

    // Primary Filters
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
    const [status, setStatus] = useState(searchParams.get('status') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    // Advanced Filters
    const [beds, setBeds] = useState(searchParams.get('beds') || '');
    const [baths, setBaths] = useState(searchParams.get('baths') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    // Amenities
    const [pool, setPool] = useState(searchParams.get('pool') === 'true');
    const [oceanView, setOceanView] = useState(searchParams.get('oceanView') === 'true');
    const [golfView, setGolfView] = useState(searchParams.get('golfView') === 'true');
    const [furnished, setFurnished] = useState(searchParams.get('furnished') === 'true');
    const [petFriendly, setPetFriendly] = useState(searchParams.get('petFriendly') === 'true');

    // UI State
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (city) params.set('city', city);
        if (propertyType) params.set('type', propertyType);
        if (status) params.set('status', status);
        if (beds) params.set('beds', beds);
        if (baths) params.set('baths', baths);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort && sort !== 'newest') params.set('sort', sort);

        if (pool) params.set('pool', 'true');
        if (oceanView) params.set('oceanView', 'true');
        if (golfView) params.set('golfView', 'true');
        if (furnished) params.set('furnished', 'true');
        if (petFriendly) params.set('petFriendly', 'true');

        router.push(`/properties?${params.toString()}`);
    };

    const clearFilters = () => {
        setCity('');
        setPropertyType('');
        setStatus('');
        setBeds('');
        setBaths('');
        setMinPrice('');
        setMaxPrice('');
        setSort('newest');
        setPool(false);
        setOceanView(false);
        setGolfView(false);
        setFurnished(false);
        setPetFriendly(false);
        router.push('/properties');
    };

    return (
        <div className="bg-navy-900/95 backdrop-blur-xl p-6 md:p-8 mb-12 rounded-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] font-outfit w-full">
            <form onSubmit={handleSearch}>
                {/* Top Row - Primary Search */}
                <div className="flex flex-col md:flex-row gap-5 items-end w-full">
                    <div className="w-full md:w-1/4">
                        <label className="block text-xs font-bold text-champagne-400 uppercase tracking-widest mb-2">{t('location')}</label>
                        <select value={city} onChange={e => setCity(e.target.value)} className="w-full px-5 py-3.5 border border-white/10 rounded-xl bg-navy-900/60 text-white focus:ring-2 focus:ring-champagne-500 outline-none transition-all placeholder:text-slate-400">
                            <option value="" className="bg-navy-900">{t('allLocations')}</option>
                            <option value="punta-cana" className="bg-navy-900">{t('puntaCana')}</option>
                            <option value="cap-cana" className="bg-navy-900">{t('capCana')}</option>
                            <option value="bavaro" className="bg-navy-900">{t('bavaro')}</option>
                            <option value="macao" className="bg-navy-900">{t('macao')}</option>
                        </select>
                    </div>

                    <div className="w-full md:w-1/4">
                        <label className="block text-xs font-bold text-champagne-400 uppercase tracking-widest mb-2">{t('status')}</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-5 py-3.5 border border-white/10 rounded-xl bg-navy-900/60 text-white focus:ring-2 focus:ring-champagne-500 outline-none transition-all">
                            <option value="" className="bg-navy-900">{t('buyAndRent')}</option>
                            <option value="for-sale" className="bg-navy-900">{t('forSale')}</option>
                            <option value="for-rent" className="bg-navy-900">{t('forRent')}</option>
                        </select>
                    </div>

                    <div className="w-full md:w-1/4">
                        <label className="block text-xs font-bold text-champagne-400 uppercase tracking-widest mb-2">{t('propertyType')}</label>
                        <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="w-full px-5 py-3.5 border border-white/10 rounded-xl bg-navy-900/60 text-white focus:ring-2 focus:ring-champagne-500 outline-none transition-all">
                            <option value="" className="bg-navy-900">{t('anyType')}</option>
                            <option value="villa" className="bg-navy-900">{t('villa')}</option>
                            <option value="condo" className="bg-navy-900">{t('condo')}</option>
                            <option value="penthouse" className="bg-navy-900">{t('penthouse')}</option>
                            <option value="land" className="bg-navy-900">{t('land')}</option>
                        </select>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-14 md:w-auto md:px-6 h-[52px] bg-navy-800 text-white border border-white/10 hover:bg-navy-700 transition-all rounded-xl flex items-center justify-center shrink-0"
                            title="Advanced Filters"
                        >
                            <SlidersHorizontal className="w-5 h-5 md:mr-2" />
                            <span className="hidden md:block text-sm font-bold tracking-widest uppercase">{t('filters')}</span>
                        </button>

                        <button type="submit" className="flex-1 md:w-auto md:px-8 h-[52px] bg-champagne-500 text-navy-900 font-bold uppercase tracking-widest rounded-xl hover:bg-champagne-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.3)] shrink-0">
                            <Search className="w-5 h-5" />
                            {t('search')}
                        </button>
                    </div>
                </div>

                {/* Exploding Advanced Tray */}
                <div className={`grid transition-all duration-300 ease-in-out ${showAdvanced ? 'grid-rows-[1fr] opacity-100 mt-8 pt-8 border-t border-white/10' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-transparent'}`}>
                    <div className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                            {/* Sliders / Selects */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('sortBy', { fallback: 'Sort By' })}</label>
                                <select value={sort} onChange={e => setSort(e.target.value)} className="w-full px-4 py-2.5 text-sm border border-white/10 rounded-lg bg-navy-900/40 text-white focus:ring-2 focus:ring-champagne-500 outline-none">
                                    <option value="newest" className="bg-navy-900">{t('newest', { fallback: 'Newest First' })}</option>
                                    <option value="price-asc" className="bg-navy-900">{t('priceAsc', { fallback: 'Price (Low to High)' })}</option>
                                    <option value="price-desc" className="bg-navy-900">{t('priceDesc', { fallback: 'Price (High to Low)' })}</option>
                                    <option value="popular" className="bg-navy-900">{t('popular', { fallback: 'Most Popular' })}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('minPrice')}</label>
                                <select value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full px-4 py-2.5 text-sm border border-white/10 rounded-lg bg-navy-900/40 text-white focus:ring-2 focus:ring-champagne-500 outline-none">
                                    <option value="" className="bg-navy-900">{t('noMin')}</option>
                                    <option value="2000" className="bg-navy-900">$2,000 ({t('rentals')})</option>
                                    <option value="5000" className="bg-navy-900">$5,000 ({t('rentals')})</option>
                                    <option value="250000" className="bg-navy-900">$250,000</option>
                                    <option value="500000" className="bg-navy-900">$500,000</option>
                                    <option value="1000000" className="bg-navy-900">$1,000,000</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('maxPrice')}</label>
                                <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full px-4 py-2.5 text-sm border border-white/10 rounded-lg bg-navy-900/40 text-white focus:ring-2 focus:ring-champagne-500 outline-none">
                                    <option value="" className="bg-navy-900">{t('noMax')}</option>
                                    <option value="5000" className="bg-navy-900">$5,000 ({t('rentals')})</option>
                                    <option value="10000" className="bg-navy-900">$10,000 ({t('rentals')})</option>
                                    <option value="500000" className="bg-navy-900">$500,000</option>
                                    <option value="1000000" className="bg-navy-900">$1,000,000</option>
                                    <option value="5000000" className="bg-navy-900">$5,000,000</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('bedrooms')}</label>
                                <select value={beds} onChange={e => setBeds(e.target.value)} className="w-full px-4 py-2.5 text-sm border border-white/10 rounded-lg bg-navy-900/40 text-white focus:ring-2 focus:ring-champagne-500 outline-none">
                                    <option value="" className="bg-navy-900">{t('any')}</option>
                                    <option value="1" className="bg-navy-900">1+</option>
                                    <option value="2" className="bg-navy-900">2+</option>
                                    <option value="3" className="bg-navy-900">3+</option>
                                    <option value="4" className="bg-navy-900">4+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('bathrooms')}</label>
                                <select value={baths} onChange={e => setBaths(e.target.value)} className="w-full px-4 py-2.5 text-sm border border-white/10 rounded-lg bg-navy-900/40 text-white focus:ring-2 focus:ring-champagne-500 outline-none">
                                    <option value="" className="bg-navy-900">{t('any')}</option>
                                    <option value="1" className="bg-navy-900">1+</option>
                                    <option value="2" className="bg-navy-900">2+</option>
                                    <option value="3" className="bg-navy-900">3+</option>
                                    <option value="4" className="bg-navy-900">4+</option>
                                </select>
                            </div>

                            {/* Amenity Checkboxes */}
                            <div className="lg:col-span-5 pt-4 border-t border-white/5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t('mustIncludeAmenities')}</label>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { id: 'pool', label: t('privatePool'), state: pool, setter: setPool },
                                        { id: 'oceanView', label: t('oceanView'), state: oceanView, setter: setOceanView },
                                        { id: 'golfView', label: t('golfView'), state: golfView, setter: setGolfView },
                                        { id: 'furnished', label: t('furnished'), state: furnished, setter: setFurnished },
                                        { id: 'petFriendly', label: t('petFriendly'), state: petFriendly, setter: setPetFriendly },
                                    ].map(amenity => (
                                        <button
                                            key={amenity.id}
                                            type="button"
                                            onClick={() => amenity.setter(!amenity.state)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all border ${amenity.state
                                                ? 'bg-champagne-500/20 border-champagne-500 text-champagne-400 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                                                : 'bg-navy-800 border-white/10 text-slate-400 hover:border-white/30'
                                                }`}
                                        >
                                            {amenity.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Action */}
                            <div className="lg:col-span-5 flex justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-xs text-rose-400 hover:text-rose-300 font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" /> {t('clearFilters')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
