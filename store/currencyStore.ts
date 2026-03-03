import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Hardcoded fallbacks if API goes down
const FALLBACK_RATES = {
    USD: 1,
    EUR: 0.92,
    CAD: 1.35,
    GBP: 0.79,
    DOP: 58.5,
};

export type CurrencyCode = 'USD' | 'EUR' | 'CAD' | 'GBP' | 'DOP';

interface CurrencyState {
    currentCurrency: CurrencyCode;
    exchangeRates: Record<CurrencyCode, number>;
    lastFetched: number | null;
    isLoading: boolean;
    setCurrency: (currency: CurrencyCode) => void;
    fetchRates: () => Promise<void>;
    convertPrice: (usdPrice: number) => number;
    formatPrice: (usdPrice: number) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            currentCurrency: 'USD',
            exchangeRates: FALLBACK_RATES,
            lastFetched: null,
            isLoading: false,

            setCurrency: (currency) => set({ currentCurrency: currency }),

            fetchRates: async () => {
                const now = Date.now();
                const { lastFetched, isLoading } = get();

                // Only fetch if it's been more than 24 hours to prevent extreme API exhaustion
                const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
                if (isLoading || (lastFetched && now - lastFetched < TWENTY_FOUR_HOURS)) {
                    return;
                }

                set({ isLoading: true });

                try {
                    // We'll use a public API or a Next.js API route that conceals the API key
                    const response = await fetch('/api/currency');

                    if (!response.ok) throw new Error('Failed to fetch rates');

                    const data = await response.json();

                    if (data && data.rates) {
                        set({
                            exchangeRates: {
                                USD: 1,
                                EUR: data.rates.EUR || FALLBACK_RATES.EUR,
                                CAD: data.rates.CAD || FALLBACK_RATES.CAD,
                                GBP: data.rates.GBP || FALLBACK_RATES.GBP,
                                DOP: data.rates.DOP || FALLBACK_RATES.DOP,
                            },
                            lastFetched: now,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    console.error('Currency sync failed, using fallback/cached rates:', error);
                    set({ isLoading: false });
                }
            },

            convertPrice: (usdPrice: number) => {
                const { currentCurrency, exchangeRates } = get();
                if (currentCurrency === 'USD') return usdPrice;
                return usdPrice * (exchangeRates[currentCurrency] || 1);
            },

            formatPrice: (usdPrice: number) => {
                const { currentCurrency, exchangeRates } = get();

                let rate = exchangeRates[currentCurrency] || 1;
                let converted = usdPrice * rate;

                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currentCurrency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                });

                return formatter.format(converted);
            }
        }),
        {
            name: 'lass-currency-storage',
            // Only persist configurations, not the loading state
            partialize: (state) => ({
                currentCurrency: state.currentCurrency,
                exchangeRates: state.exchangeRates,
                lastFetched: state.lastFetched
            }),
        }
    )
);
