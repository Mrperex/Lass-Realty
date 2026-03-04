import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import ReportCard from './ReportCard';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const isEs = locale === 'es';
    return {
        title: isEs
            ? 'Informes del Mercado | LASS Realty'
            : 'Market Reports | LASS Realty',
        description: isEs
            ? 'Descargue informes gratuitos sobre el mercado inmobiliario de Punta Cana. Tendencias, rendimientos de alquiler y guías para compradores extranjeros.'
            : 'Download free Punta Cana real estate market reports. Trends, rental yields, and guides for foreign buyers.',
    };
}

const reports = [
    {
        id: 'market-overview-2026',
        title: 'Punta Cana Market Overview 2026',
        title_es: 'Panorama del Mercado de Punta Cana 2026',
        description: 'Comprehensive analysis of property values, appreciation rates (8.4% CAGR), tourism growth (12M+ visitors), and investment hotspots across the Punta Cana corridor.',
        description_es: 'Análisis integral de valores de propiedades, tasas de apreciación (8.4% CAGR), crecimiento turístico (12M+ visitantes) y puntos de inversión clave en el corredor de Punta Cana.',
        coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
        pages: 18,
        category: 'Market Analysis',
        category_es: 'Análisis de Mercado',
    },
    {
        id: 'foreign-buyer-guide',
        title: "Foreign Buyer's Guide to Dominican Republic Real Estate",
        title_es: 'Guía del Comprador Extranjero para Bienes Raíces en República Dominicana',
        description: 'Everything you need to know: Law 16-95 ownership rights, CONFOTUR tax incentives, financing options, closing costs (4.5-7%), and step-by-step buying process.',
        description_es: 'Todo lo que necesitas saber: derechos de propiedad bajo la Ley 16-95, incentivos fiscales CONFOTUR, opciones de financiamiento, costos de cierre (4.5-7%) y proceso de compra paso a paso.',
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
        pages: 24,
        category: 'Buying Guide',
        category_es: 'Guía de Compra',
    },
    {
        id: 'roi-neighborhood-analysis',
        title: 'ROI by Neighborhood: Rental Yield Report',
        title_es: 'ROI por Vecindario: Informe de Rendimientos de Alquiler',
        description: 'Detailed comparison of net rental yields across 5 key neighborhoods: Bávaro (9-11%), Cap Cana (7-9%), Cana Bay (8-10%), Downtown (6-8%), and Vista Cana (6-7%).',
        description_es: 'Comparación detallada de rendimientos netos de alquiler en 5 vecindarios clave: Bávaro (9-11%), Cap Cana (7-9%), Cana Bay (8-10%), Downtown (6-8%) y Vista Cana (6-7%).',
        coverImage: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=800',
        pages: 14,
        category: 'Investment',
        category_es: 'Inversión',
    },
];

export default async function MarketReportsPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const isEs = locale === 'es';

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-cormorant font-medium text-[#0a1128] mb-6">
                        {isEs ? 'Informes del Mercado' : 'Market Reports'}
                    </h1>
                    <p className="text-lg text-gray-600 font-outfit">
                        {isEs
                            ? 'Descargue informes gratuitos con datos exclusivos sobre el mercado inmobiliario de Punta Cana. Ingrese su correo electrónico para acceder a nuestros análisis detallados.'
                            : 'Download free reports with exclusive data on the Punta Cana real estate market. Enter your email to access our detailed analyses.'}
                    </p>
                </div>

                {/* Report Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reports.map((report) => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            locale={locale}
                        />
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-400 font-outfit">
                        {isEs
                            ? '📊 Datos actualizados trimestralmente • 🔒 Su información está segura • ✉️ Sin spam, lo prometemos'
                            : '📊 Data updated quarterly • 🔒 Your information is secure • ✉️ No spam, we promise'}
                    </p>
                </div>
            </div>
        </main>
    );
}
