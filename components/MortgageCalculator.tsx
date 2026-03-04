'use client';

import { useState, useMemo } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';
import { Calculator, Percent, DollarSign, TrendingUp } from 'lucide-react';

interface MortgageCalculatorProps {
    propertyPriceUsd: number;
}

export default function MortgageCalculator({ propertyPriceUsd }: MortgageCalculatorProps) {
    const { formatPrice, convertPrice, currentCurrency } = useCurrencyStore();

    // Convert base property price to current user currency for calculation baseline
    const basePrice = convertPrice(propertyPriceUsd);

    const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
    const [interestRate, setInterestRate] = useState<number>(6.5);
    const [loanTermYears, setLoanTermYears] = useState<number>(30);
    const [estimatedMonthlyRent, setEstimatedMonthlyRent] = useState<number>(convertPrice(propertyPriceUsd > 1000000 ? 8000 : 3500));

    // Ensure down payment is a valid amount based on the percentage
    const downPaymentAmount = (downPaymentPercent / 100) * basePrice;
    const loanAmount = basePrice - downPaymentAmount;

    // Monthly Mortgage Calculation (Standard Amortization Formula)
    const monthlyPayment = useMemo(() => {
        if (loanAmount <= 0) return 0;
        if (interestRate === 0) return loanAmount / (loanTermYears * 12);

        const monthlyInterestRate = (interestRate / 100) / 12;
        const numberOfPayments = loanTermYears * 12;

        const mathPower = Math.pow(1 + monthlyInterestRate, numberOfPayments);
        const monthly = (loanAmount * monthlyInterestRate * mathPower) / (mathPower - 1);

        return monthly;
    }, [loanAmount, interestRate, loanTermYears]);

    // ROI / Investment Calculations
    const annualRent = estimatedMonthlyRent * 12;
    // Simple Cap Rate = Net Operating Income (NOI) / Property Price. 
    // Assuming 25% of gross rent goes to expenses for a simple NOI estimate.
    const noi = annualRent * 0.75;
    const capRate = (noi / basePrice) * 100;

    // Cash on Cash Return = Annual Cash Flow / Total Cash Invested (Down Payment)
    const annualMortgagePayment = monthlyPayment * 12;
    const annualCashFlow = noi - annualMortgagePayment;
    const cashOnCashReturn = downPaymentAmount > 0 ? (annualCashFlow / downPaymentAmount) * 100 : 0;

    const formatShortCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currentCurrency,
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_20px_40px_-15px_rgba(10,17,40,0.05)] font-outfit">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 bg-champagne-500/10 rounded-2xl flex items-center justify-center text-champagne-600">
                    <Calculator className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-cormorant text-2xl font-medium text-navy-900">Investment Calculator</h3>
                    <p className="text-slate-500 text-sm">Estimate mortgage costs and ROI</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Inputs Column */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest text-xs">Down Payment</label>
                            <span className="text-navy-900 font-semibold">{downPaymentPercent}% ({formatShortCurrency(downPaymentAmount)})</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={downPaymentPercent}
                            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-champagne-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest text-xs mb-2">Interest Rate (%)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Percent className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                                    // Handle direct typing properly
                                    onBlur={(e) => setInterestRate(Number(e.target.value) || 0)}
                                    step="0.1"
                                    className="pl-9 w-full rounded-xl border-slate-200 border bg-slate-50 py-3 text-navy-900 focus:ring-champagne-500 focus:border-champagne-500 font-medium"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest text-xs mb-2">Loan Term (Yrs)</label>
                            <select
                                value={loanTermYears}
                                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                                className="w-full rounded-xl border-slate-200 border bg-slate-50 py-3 px-4 text-navy-900 focus:ring-champagne-500 focus:border-champagne-500 font-medium appearance-none"
                            >
                                <option value={15}>15 Years</option>
                                <option value={20}>20 Years</option>
                                <option value={30}>30 Years</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest text-xs mb-2">Est. Monthly Rent</label>
                        <div className="relative border-b-2 border-slate-200 focus-within:border-champagne-500 transition-colors pb-1">
                            <span className="absolute left-0 bottom-2 text-slate-400 font-semibold">{currentCurrency}</span>
                            <input
                                type="number"
                                value={estimatedMonthlyRent}
                                onChange={(e) => setEstimatedMonthlyRent(Number(e.target.value) || 0)}
                                className="w-full pl-12 bg-transparent text-navy-900 font-bold text-xl focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Outputs Column */}
                <div className="bg-navy-900 rounded-2xl p-6 lg:p-8 flex flex-col justify-between text-offwhite shadow-inner relative overflow-hidden">
                    {/* Decorative abstract elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-champagne-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10 mb-8">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Estimated Payment</div>
                        <div className="flex items-end gap-2 text-champagne-400">
                            <span className="text-4xl md:text-5xl font-cormorant font-medium tracking-tight">
                                {formatShortCurrency(monthlyPayment)}
                            </span>
                            <span className="text-slate-400 font-outfit font-medium mb-1.5">/mo</span>
                        </div>
                        <div className="text-sm text-slate-500 mt-2">Principal & Interest only. Taxes/Insurance not included.</div>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        <div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                Est. Cap Rate
                            </div>
                            <div className="text-2xl font-semibold text-white">
                                {capRate.toFixed(2)}%
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                Est. Net Flow
                            </div>
                            <div className="text-2xl font-semibold text-white">
                                <span className={annualCashFlow > 0 ? "text-emerald-400" : "text-rose-400"}>
                                    {annualCashFlow > 0 ? '+' : ''}{formatShortCurrency(annualCashFlow / 12)}
                                </span>
                                <span className="text-sm text-slate-500 ml-1">/mo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
