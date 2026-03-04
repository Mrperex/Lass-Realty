import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProperty } from '@/types/property';

interface CompareState {
    compareList: IProperty[];
    isDockOpen: boolean;
    addCompare: (property: IProperty) => void;
    removeCompare: (id: string) => void;
    clearCompare: () => void;
    openDock: () => void;
    closeDock: () => void;
}

export const useCompareStore = create<CompareState>()(
    persist(
        (set) => ({
            compareList: [],
            isDockOpen: false,
            addCompare: (property) => set((state) => {
                const isAlreadyAdded = state.compareList.find((p) => p._id === property._id);
                // If already added, just ensure the dock opens
                if (isAlreadyAdded) return { compareList: state.compareList, isDockOpen: true };

                // Allow maximum of 3 properties for side-by-side comparison
                if (state.compareList.length >= 3) {
                    // Flash the dock open if trying to add a 4th, but don't add it
                    return { compareList: state.compareList, isDockOpen: true };
                }

                return { compareList: [...state.compareList, property], isDockOpen: true };
            }),
            removeCompare: (id) => set((state) => {
                const newList = state.compareList.filter((p) => p._id !== id);
                return {
                    compareList: newList,
                    // Auto-close dock if list becomes empty
                    isDockOpen: newList.length > 0 ? state.isDockOpen : false
                };
            }),
            clearCompare: () => set({ compareList: [], isDockOpen: false }),
            openDock: () => set({ isDockOpen: true }),
            closeDock: () => set({ isDockOpen: false }),
        }),
        {
            name: 'lass-compare-storage',
        }
    )
);
