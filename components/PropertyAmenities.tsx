import {
    ShieldCheck, CloudLightning, Droplets, Zap, Shield, Camera, Lock, Key,
    Waves, Sun, Palmtree, UtensilsCrossed, Tent, Anchor, Mountain,
    PartyPopper, Trophy, Dumbbell, Baby, MonitorPlay, Briefcase, Wine,
    Wind, ArrowUpToLine, Sofa, PawPrint, CheckCircle2
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
    // Infrastructure
    'Backup Generator': <Zap className="w-5 h-5" />,
    'Water System / Cistern': <Droplets className="w-5 h-5" />,
    'Water Heater': <Droplets className="w-5 h-5 text-red-400" />,
    'Fiber Optic Internet': <CloudLightning className="w-5 h-5" />,
    'Underground Cabling': <Zap className="w-5 h-5 text-slate-400" />,

    // Security
    '24/7 Security': <ShieldCheck className="w-5 h-5" />,
    'Gated Community': <Lock className="w-5 h-5" />,
    'Surveillance Cameras': <Camera className="w-5 h-5" />,
    'Controlled Access': <Shield className="w-5 h-5" />,
    'Smart Lock': <Key className="w-5 h-5" />,

    // Outdoor & Leisure
    'Private Pool': <Waves className="w-5 h-5" />,
    'Infinity Pool': <Waves className="w-5 h-5 text-cyan-500" />,
    'Artificial Beach': <Palmtree className="w-5 h-5" />,
    'Jacuzzi': <Waves className="w-5 h-5 text-blue-400" />,
    'BBQ Area': <UtensilsCrossed className="w-5 h-5" />,
    'Gazebo': <Tent className="w-5 h-5" />,
    'Wrap Around Balcony': <Sun className="w-5 h-5" />,
    'Ocean Front': <Anchor className="w-5 h-5" />,
    'Ocean View': <Waves className="w-5 h-5 text-emerald-500" />,
    'Golf View': <Mountain className="w-5 h-5" />,

    // Community & Shared
    'Club House': <PartyPopper className="w-5 h-5" />,
    'Basketball Court': <Trophy className="w-5 h-5" />,
    'Tennis / Padel Court': <Trophy className="w-5 h-5" />,
    'Kids Playground': <Baby className="w-5 h-5" />,
    'Gym': <Dumbbell className="w-5 h-5" />,
    'Co-working Space': <Briefcase className="w-5 h-5" />,

    // Interior & Luxury
    'Wine Cellar': <Wine className="w-5 h-5" />,
    'Smart Home Integration': <MonitorPlay className="w-5 h-5" />,
    "Maid's Quarters": <CheckCircle2 className="w-5 h-5" />,
    'Central AC': <Wind className="w-5 h-5" />,
    'Elevator': <ArrowUpToLine className="w-5 h-5" />,
    'Fully Furnished': <Sofa className="w-5 h-5" />,
    'Pet Friendly': <PawPrint className="w-5 h-5" />
};

export default function PropertyAmenities({ amenities }: { amenities: string[] }) {
    if (!amenities || amenities.length === 0) return null;

    return (
        <div className="py-8 border-y border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Features & Amenities</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                        <div className="p-2.5 bg-champagne-500/10 text-champagne-600 rounded-xl">
                            {ICON_MAP[amenity] || <CheckCircle2 className="w-5 h-5 text-champagne-500" />}
                        </div>
                        <span className="font-medium text-slate-700 text-sm">{amenity}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
