'use client';

import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/store/favoritesStore';
import { IProperty } from '@/types/property';
import { MouseEvent, useEffect, useState } from 'react';

export default function FavoriteButton({ property }: { property: IProperty }) {
    const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

    // Prevent hydration mismatch by only rendering after mount
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-full bg-white/50 backdrop-blur-md shadow-sm border border-white/20">
                <Heart className="w-5 h-5 text-slate-300" />
            </button>
        );
    }

    const isFav = property.slug ? isFavorite(property.slug) : false;

    const toggleFavorite = (e: MouseEvent) => {
        e.preventDefault(); // Stop Link navigation
        if (!property.slug) return;

        if (isFav) {
            removeFavorite(property.slug);
        } else {
            addFavorite(property);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            className={`p-3 md:p-2 rounded-full backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.1)] border flex items-center justify-center min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 transition-all duration-300 ${isFav
                ? 'bg-rose-50 border-rose-200 hover:bg-rose-100 bg-opacity-90'
                : 'bg-white/80 border-white/40 hover:bg-white'
                }`}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={`w-5 h-5 transition-colors ${isFav
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-600 hover:text-rose-500 stroke-[2.5]'
                    }`}
            />
        </button>
    );
}
