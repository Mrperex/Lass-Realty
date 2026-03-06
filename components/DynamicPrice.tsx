'use client';

import { useEffect, useState } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';
import { formatCurrency } from '@/lib/utils'; // Fallback server formatter

export default function DynamicPrice({ price, period, className = '' }: { price: number; period?: 'monthly' | 'nightly' | string; className?: string }) {
    const { formatPrice } = useCurrencyStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch between Server (always USD) and Client (LocalStorage preference)
    useEffect(() => {
        setMounted(true);
    }, []);

    const suffix = period === 'monthly' ? ' /mo' : period === 'nightly' ? ' /night' : '';

    // Render the static USD fallback while server-side rendering, then swap to the dynamic user currency
    if (!mounted) {
        return <span className={className}>{formatCurrency(price)}{suffix}</span>;
    }

    return <span className={className}>{formatPrice(price)}{suffix}</span>;
}
