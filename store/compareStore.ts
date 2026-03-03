import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProperty } from '@/types/property';

interface CompareState {
    compareList: IProperty[];
    addCompare: (property: IProperty) => void;
    removeCompare: (id: string) => void;
    clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
    persist(
        (set) => ({
            compareList: [],
            addCompare: (property) => set((state) => {
                const isAlreadyAdded = state.compareList.find((p) => p._id === property._id);
                if (isAlreadyAdded) return { compareList: state.compareList };

                // Allow maximum of 2 properties for side-by-side comparison
                if (state.compareList.length >= 2) {
                    return { compareList: [state.compareList[1], property] };
                }

                return { compareList: [...state.compareList, property] };
            }),
            removeCompare: (id) => set((state) => ({
                compareList: state.compareList.filter((p) => p._id !== id)
            })),
            clearCompare: () => set({ compareList: [] })
        }),
        {
            name: 'lass-compare-storage',
        }
    )
);
