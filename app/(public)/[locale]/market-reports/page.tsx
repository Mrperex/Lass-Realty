import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import ReportCard from './ReportCard';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'MarketReports' });
    return {
        title: `${t('title')} | LASS Realty`,
        description: t('description'),
    };
}

const reports = [
    {
        id: 'market-overview-2026',
        keyPrefix: 'r1',
        coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
        pages: 18,
    },
    {
        id: 'foreign-buyer-guide',
        keyPrefix: 'r2',
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
        pages: 24,
    },
    {
        id: 'roi-neighborhood-analysis',
        keyPrefix: 'r3',
        coverImage: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=800',
        pages: 14,
    },
];

export default async function MarketReportsPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const t = await getTranslations('MarketReports');

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-cormorant font-medium text-[#0a1128] mb-6">
                        {t('pageTitle')}
                    </h1>
                    <p className="text-lg text-gray-600 font-outfit">
                        {t('pageSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reports.map((report) => (
                        <ReportCard
                            key={report.id}
                            report={{
                                id: report.id,
                                title: t(`${report.keyPrefix}Title`),
                                description: t(`${report.keyPrefix}Desc`),
                                category: t(`${report.keyPrefix}Cat`),
                                coverImage: report.coverImage,
                                pages: report.pages
                            }}
                        />
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-400 font-outfit">
                        {t('trustBadges')}
                    </p>
                </div>
            </div>
        </main>
    );
}
