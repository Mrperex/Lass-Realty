import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProperty } from '@/types/property';

interface RecentState {
    recentProperties: IProperty[];
    addRecent: (property: IProperty) => void;
    clearRecent: () => void;
}

export const useRecentStore = create<RecentState>()(
    persist(
        (set) => ({
            recentProperties: [],
            addRecent: (property) =>
                set((state) => {
                    // Remove if already exists so we can move it to the front
                    const filtered = state.recentProperties.filter((p) => p.slug !== property.slug);
                    return {
                        // Max 6 recently viewed properties
                        recentProperties: [property, ...filtered].slice(0, 6)
                    };
                }),
            clearRecent: () => set({ recentProperties: [] }),
        }),
        {
            name: 'lass-realty-recent',
        }
    )
);
