'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrencyStore, CurrencyCode } from '@/store/currencyStore';
import { ChevronDown, Globe } from 'lucide-react';

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
    { code: 'DOP', label: 'Dominican Peso', symbol: 'RD$' },
];

export default function CurrencySelector() {
    const { currentCurrency, setCurrency, fetchRates, isLoading } = useCurrencyStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial sync of live forex rates
    useEffect(() => {
        fetchRates();
    }, [fetchRates]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (code: CurrencyCode) => {
        setCurrency(code);
        setIsOpen(false);
    };

    const currentDetails = CURRENCIES.find(c => c.code === currentCurrency) || CURRENCIES[0];

    return (
        <div className="relative font-outfit" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/60 shadow-sm"
                aria-label="Change currency"
                disabled={isLoading}
            >
                <Globe className={`w-4 h-4 ${isLoading ? 'animate-spin text-slate-400' : 'text-slate-500'}`} />
                <span className="font-semibold text-sm tracking-wide">{currentCurrency}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                        {CURRENCIES.map((currency) => (
                            <button
                                key={currency.code}
                                onClick={() => handleSelect(currency.code)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex justify-between items-center group
                                    ${currentCurrency === currency.code
                                        ? 'bg-champagne-50 text-amber-900 font-bold'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-5 text-slate-400 group-hover:text-amber-500 transition-colors">{currency.symbol}</span>
                                    <span>{currency.code}</span>
                                </span>
                                <span className={`text-xs ${currentCurrency === currency.code ? 'text-amber-700' : 'text-slate-400'}`}>
                                    {currency.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
