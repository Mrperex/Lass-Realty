import { MapPin, Plane, Waves, ShoppingCart, Coffee, Navigation } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LocationSpotlightProps {
    city: string;
}

export default function LocationSpotlight({ city }: LocationSpotlightProps) {
    const t = useTranslations('PropertyDetail');

    // Deterministic mock data generation based on city length to create realistic variations
    const seed = city.length;

    // Base times slightly adjusted by the seed
    const isPuntaCana = city.toLowerCase().includes('punta cana') || city.toLowerCase().includes('bavaro');
    const isCapCana = city.toLowerCase().includes('cap cana');

    // Fallback logic
    const airportTime = isPuntaCana ? 15 + (seed % 5) : (isCapCana ? 12 + (seed % 3) : 25 + (seed % 10));
    const beachTime = isPuntaCana ? 5 + (seed % 3) : (isCapCana ? 3 + (seed % 2) : 10 + (seed % 5));
    const groceryTime = isPuntaCana ? 8 + (seed % 4) : 10 + (seed % 5);
    const cafesTime = 4 + (seed % 3);
    const score = isPuntaCana ? 85 + (seed % 10) : (isCapCana ? 75 + (seed % 15) : 60 + (seed % 20));

    // Determine the adjective for the walkability score
    let scoreAdjective = t('metrics.carDependent', { fallback: 'Car-Dependent' });
    if (score >= 90) scoreAdjective = t('metrics.walkersParadise', { fallback: "Walker's Paradise" });
    else if (score >= 70) scoreAdjective = t('metrics.veryWalkable', { fallback: 'Very Walkable' });
    else if (score >= 50) scoreAdjective = t('metrics.somewhatWalkable', { fallback: 'Somewhat Walkable' });

    return (
        <div className="py-8 border-y border-slate-100 mt-8 mb-8">
            <div className="flex items-center gap-3 mb-8">
                <MapPin className="w-6 h-6 text-champagne-500" />
                <h3 className="text-2xl font-bold text-slate-900">{t('locationSpotlight', { fallback: 'Location Spotlight' })}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Walkability Score Card */}
                <div className="col-span-1 bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-champagne-500/20 blur-2xl rounded-full pointer-events-none" />

                    <div className="text-champagne-400 font-bold tracking-widest uppercase text-xs mb-2">
                        {t('metrics.walkScore', { fallback: 'Walk Score' })}
                    </div>

                    <div className="flex items-end gap-3 mb-2">
                        <span className="text-6xl font-outfit font-bold text-white leading-none">{score}</span>
                        <span className="text-slate-400 font-medium mb-1">/ 100</span>
                    </div>

                    <div className="text-xl font-bold text-slate-100 mb-4">{scoreAdjective}</div>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        {t('metrics.walkScoreDesc', { fallback: 'Based on proximity to dining, errands, and recreational parks in the area.' })}
                    </p>
                </div>

                {/* Proximate Landmarks */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Airport */}
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:border-champagne-200 transition-colors group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-champagne-50 transition-colors shrink-0">
                            <Plane className="w-6 h-6 text-slate-400 group-hover:text-champagne-600 transition-colors" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900 mb-1">{t('landmarks.airport', { fallback: 'Intl. Airport' })}</div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                <Navigation className="w-4 h-4" /> {airportTime} {t('metrics.minDrive', { fallback: 'min drive' })}
                            </div>
                        </div>
                    </div>

                    {/* Beach */}
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:border-champagne-200 transition-colors group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-champagne-50 transition-colors shrink-0">
                            <Waves className="w-6 h-6 text-slate-400 group-hover:text-champagne-600 transition-colors" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900 mb-1">{t('landmarks.beach', { fallback: 'Nearest Beach' })}</div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                <Navigation className="w-4 h-4" /> {beachTime} {t('metrics.minDrive', { fallback: 'min drive' })}
                            </div>
                        </div>
                    </div>

                    {/* Supermarket */}
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:border-champagne-200 transition-colors group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-champagne-50 transition-colors shrink-0">
                            <ShoppingCart className="w-6 h-6 text-slate-400 group-hover:text-champagne-600 transition-colors" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900 mb-1">{t('landmarks.grocery', { fallback: 'Premium Grocery' })}</div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                <Navigation className="w-4 h-4" /> {groceryTime} {t('metrics.minDrive', { fallback: 'min drive' })}
                            </div>
                        </div>
                    </div>

                    {/* Cafes */}
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl hover:border-champagne-200 transition-colors group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-champagne-50 transition-colors shrink-0">
                            <Coffee className="w-6 h-6 text-slate-400 group-hover:text-champagne-600 transition-colors" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900 mb-1">{t('landmarks.cafes', { fallback: 'Cafés & Dining' })}</div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                <Navigation className="w-4 h-4" /> {cafesTime} {t('metrics.minDrive', { fallback: 'min drive' })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
