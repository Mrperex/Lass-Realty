'use client';

import Image from 'next/image';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

type ReportProps = {
    report: {
        id: string;
        title: string;
        description: string;
        coverImage: string;
        pages: number;
        category: string;
    };
};

export default function ReportCard({ report }: ReportProps) {
    const t = useTranslations('MarketReports');
    const [isHovered, setIsHovered] = useState(false);

    const { title, description, category } = report;

    return (
        <div
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-900/5">
                <Image
                    src={report.coverImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-navy-900 border border-white shadow-sm z-10 font-outfit">
                    {category}
                </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-cormorant font-bold text-navy-900 mb-3 leading-tight group-hover:text-champagne-500 transition-colors">
                    {title}
                </h3>

                <p className="text-slate-600 font-outfit text-sm leading-relaxed mb-6 flex-grow">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 font-outfit">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        {report.pages} {t('pages')}
                    </span>

                    <button className="flex items-center gap-2 text-sm font-bold text-champagne-600 hover:text-champagne-500 transition-colors uppercase tracking-widest">
                        {t('download')}
                        <Download className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
