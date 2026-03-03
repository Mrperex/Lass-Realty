'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { IProperty } from '@/types/property';
import { Link } from '@/navigation';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Bed, Bath } from 'lucide-react';

// Fix Leaflet's default icon path issues with varying environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Luxury Marker Icon
const luxuryIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `
        <div class="bg-navy-900 border-2 border-champagne-500 rounded-full w-4 h-4 shadow-[0_0_10px_rgba(212,175,55,0.8)] relative -left-2 -top-2"></div>
    `,
});

export default function PropertyMap({ properties }: { properties: IProperty[] }) {
    // Default center to Dominican Republic / Punta Cana if no properties have coordinates
    let center: [number, number] = [18.582, -68.4054];
    if (properties.length > 0) {
        const firstWithCoords = properties.find(p => p.coordinates?.lat && p.coordinates?.lng);
        if (firstWithCoords && firstWithCoords.coordinates) {
            center = [firstWithCoords.coordinates.lat, firstWithCoords.coordinates.lng];
        }
    }

    return (
        <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-sm z-0 relative font-outfit">
            <MapContainer
                center={center}
                zoom={11}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                {/* Premium Map CartoDB Layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {properties.map((property) => {
                    if (!property.coordinates?.lat || !property.coordinates?.lng) return null;

                    return (
                        <Marker
                            key={property._id?.toString() || property.slug}
                            position={[property.coordinates.lat, property.coordinates.lng]}
                            icon={luxuryIcon}
                        >
                            <Popup className="property-popup font-outfit" minWidth={260} maxWidth={260}>
                                <div className="rounded-xl overflow-hidden -m-[13px] relative bg-white">
                                    <Link href={`/properties/${property.slug}`} className="block group">
                                        <div className="relative aspect-video">
                                            {property.images && property.images.length > 0 ? (
                                                <Image
                                                    src={property.images[0]}
                                                    alt={property.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">No image</div>
                                            )}
                                            <div className="absolute bottom-2 left-2 bg-navy-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-champagne-400">
                                                {formatCurrency(property.price)}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-playfair text-sm font-bold text-navy-900 truncate mb-1">{property.title}</h4>
                                            <div className="flex gap-3 text-xs text-slate-500 font-semibold">
                                                <span className="flex items-center gap-1"><Bed className="w-3 h-3 text-champagne-500" /> {property.bedrooms}</span>
                                                <span className="flex items-center gap-1"><Bath className="w-3 h-3 text-champagne-500" /> {property.bathrooms}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
