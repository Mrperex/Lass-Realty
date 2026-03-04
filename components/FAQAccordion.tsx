'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

interface FAQAccordionProps {
    items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4 font-outfit">
            {items.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                    <div
                        key={index}
                        className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen
                                ? 'bg-white border-champagne-300 shadow-[0_10px_30px_-15px_rgba(212,175,55,0.2)]'
                                : 'bg-slate-50 border-slate-200 hover:border-champagne-200'
                            }`}
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full px-6 py-5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-500 rounded-2xl text-left"
                            aria-expanded={isOpen}
                        >
                            <span className={`font-cormorant text-lg md:text-xl font-bold pr-8 transition-colors ${isOpen ? 'text-navy-900' : 'text-slate-700'}`}>
                                {item.question}
                            </span>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-champagne-500 text-navy-900' : 'bg-slate-200 text-slate-500'}`}>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed font-light">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
