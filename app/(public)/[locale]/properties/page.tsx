import { Link } from '@/navigation';
import SearchFilters from '@/components/SearchFilters';
import { getTranslations } from 'next-intl/server';
import PropertiesContent from './PropertiesContent';
import SeoHead from '@/components/SeoHead';
import { Metadata } from 'next';

// This page is now streaming - no revalidate needed as we handle caching differently
export const dynamic = 'force-dynamic';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'PropertiesList' });
    return {
        title: `${t('title')} | LASS Realty`,
        description: t('description'),
        openGraph: {
            title: `${t('title')} | LASS Realty`,
            description: t('description'),
            images: ['/images/og-properties.jpg']
        }
    };
}

export default async function PropertiesPage({ searchParams, params }: { searchParams: { [key: string]: string | string[] | undefined }, params: { locale: string } }) {
    const t = await getTranslations({ locale: params.locale, namespace: 'PropertiesList' });

    return (
        <div className="py-16 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">{t('title')}</h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        {t('description')}
                    </p>
                </div>

                <SearchFilters />

                <PropertiesContent 
                    searchParams={searchParams}
                    locale={params.locale} 
                />
            </div>
        </div>
    );
}
