'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Check, X } from 'lucide-react';

const AVAILABLE_AMENITIES = [
    { key: 'pool', label: 'Private Pool' },
    { key: 'oceanView', label: 'Ocean View' },
    { key: 'golfView', label: 'Golf Course View' },
    { key: 'furnished', label: 'Fully Furnished' },
    { key: 'petFriendly', label: 'Pet Friendly' },
    { key: 'gym', label: 'Fitness Center / Gym' },
    { key: 'spa', label: 'Spa & Wellness' },
    { key: 'tennisCourt', label: 'Tennis Court' },
    { key: 'security24h', label: '24/7 Security' },
    { key: 'gatedCommunity', label: 'Gated Community' },
    { key: 'beachAccess', label: 'Private Beach Access' },
    { key: 'balcony', label: 'Balcony' },
    { key: 'terrace', label: 'Terrace' },
    { key: 'garden', label: 'Private Garden' },
    { key: 'parking', label: 'Covered Parking' },
    { key: 'elevator', label: 'Elevator' },
    { key: 'airConditioning', label: 'Air Conditioning' },
    { key: 'smartHome', label: 'Smart Home System' },
    { key: 'maidQuarters', label: 'Maid Quarters' },
    { key: 'wineCellar', label: 'Wine Cellar' },
    { key: 'homeTheater', label: 'Home Theater' },
    { key: 'helipad', label: 'Helipad' },
    { key: 'privateDock', label: 'Private Marina Dock' },
    { key: 'clubhouse', label: 'Clubhouse Access' },
    { key: 'kidsPlayground', label: 'Kids Playground' },
    { key: 'bbqArea', label: 'BBQ Area' },
    { key: 'solarPanels', label: 'Solar Panels' },
    { key: 'backupGenerator', label: 'Backup Generator' },
    { key: 'waterCistern', label: 'Water Cistern' },
    { key: 'concierge', label: 'Concierge Service' },
    { key: 'coworking', label: 'Co-working Space' },
];

export default function AmenitiesMultiSelect({
    initialSelected = []
}: {
    initialSelected?: string[]
}) {
    const [selected, setSelected] = useState<string[]>(initialSelected);
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter amenities based on search
    const filteredAmenities = useMemo(() => {
        return AVAILABLE_AMENITIES.filter(amenity =>
            amenity.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const toggleAmenity = (key: string) => {
        setSelected(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const removeAmenity = (key: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected(prev => prev.filter(k => k !== key));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            {/* Hidden inputs to sync with the main FormData */}
            {selected.map(item => (
                <input key={item} type="hidden" name="amenities[]" value={item} />
            ))}

            <div
                className="min-h-[50px] w-full p-2 bg-white border border-slate-300 rounded-xl focus-within:ring-2 ring-navy-600 focus-within:border-navy-600 cursor-text flex flex-wrap gap-2 items-center"
                onClick={() => setIsOpen(true)}
            >
                {/* Selected Pills */}
                {selected.length > 0 ? (
                    selected.map(key => {
                        const amenity = AVAILABLE_AMENITIES.find(a => a.key === key);
                        // Handle legacy strings that might actually be loaded as initialSelected
                        const label = amenity ? amenity.label : key;
                        return (
                            <span
                                key={key}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-navy-50 text-navy-700 border border-navy-100"
                            >
                                {label}
                                <button
                                    type="button"
                                    onClick={(e) => removeAmenity(key, e)}
                                    className="ml-2 hover:bg-navy-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        );
                    })
                ) : (
                    <span className="text-slate-400 pl-2">Select amenities...</span>
                )}

                {/* Search Input inline */}
                <input
                    type="text"
                    className="flex-1 min-w-[120px] outline-none border-none bg-transparent h-8 mt-0.5 text-sm"
                    placeholder={selected.length ? "" : "Search..."}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredAmenities.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-sm">No amenities found.</div>
                    ) : (
                        <ul className="py-1">
                            {filteredAmenities.map((amenity) => {
                                const isSelected = selected.includes(amenity.key);
                                return (
                                    <li
                                        key={amenity.key}
                                        onClick={() => toggleAmenity(amenity.key)}
                                        className={`px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-navy-50' : ''}`}
                                    >
                                        <span className={`text-sm ${isSelected ? 'text-navy-900 font-medium' : 'text-slate-700'}`}>
                                            {amenity.label}
                                        </span>
                                        {isSelected && <Check className="w-4 h-4 text-navy-600" />}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
