import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProperty } from '@/types/property';

// Pre-hydrate check to avoid hydration mismatch in Next.js SSR
interface FavoritesState {
    favorites: IProperty[];
    addFavorite: (property: IProperty) => void;
    removeFavorite: (slug: string) => void;
    isFavorite: (slug: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (property) =>
                set((state) => ({
                    favorites: [...state.favorites, property]
                })),
            removeFavorite: (slug) =>
                set((state) => ({
                    favorites: state.favorites.filter((p) => p.slug !== slug)
                })),
            isFavorite: (slug) => {
                return get().favorites.some((p) => p.slug === slug);
            }
        }),
        {
            name: 'lass-realty-favorites',
        }
    )
);
