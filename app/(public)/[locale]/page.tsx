import { Link } from '@/navigation';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import PropertyGrid from '@/components/PropertyGrid';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { LOCATIONS } from '@/lib/locations';
import SearchFilters from '@/components/SearchFilters';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import WhyLassRealty from '@/components/WhyLassRealty';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-3xl border border-slate-200" />
});

export const revalidate = 3600;

async function getFeaturedProperties() {
    try {
        await connectToDatabase();
        if (!mongoose.connection.readyState) return [];
        const properties = await Property.find({ featured: true }).limit(3).lean();
        return JSON.parse(JSON.stringify(properties));
    } catch (error) {
        console.warn('Failed to fetch featured properties:', error);
        return [];
    }
}

export default async function Home() {
    const featuredProperties = await getFeaturedProperties();
    const t = await getTranslations('Index');

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-12">
                <div className="absolute inset-0 bg-slate-900/60 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-mansion-with-a-pool-2253-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center flex-1 justify-center w-full">
                    <span className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-4 drop-shadow-md">{t('subtitle')}</span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-xl leading-tight">
                        {t.rich('title', {
                            highlight: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-100 mb-12 max-w-3xl mx-auto font-light drop-shadow-lg">
                        {t('description')}
                    </p>

                    {/* Integrated Search Box - Hidden on very small screens to save space, but visible starting 'sm' */}
                    <div className="w-full max-w-4xl mx-auto mt-4 hidden sm:block">
                        <div className="bg-white/10 backdrop-blur-xl p-2 rounded-3xl border border-white/20 shadow-2xl">
                            <SearchFilters />
                        </div>
                    </div>

                    <div className="flex flex-col sm:hidden w-full gap-4 justify-center mt-6">
                        <Link
                            href="/properties"
                            className="inline-flex items-center justify-center bg-amber-600 text-white w-full py-4 rounded-xl font-bold hover:bg-amber-500 transition shadow-xl"
                        >
                            {t('explore')}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust / Credibility Strip */}
            <section className="bg-slate-900 py-8 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-amber-500 mb-1">$100M+</span>
                            <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t('trust.turnover')}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-amber-500 mb-1">500+</span>
                            <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t('trust.propertiesSold')}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-amber-500 mb-1">15+</span>
                            <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t('trust.yearsExperience')}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="flex items-center gap-1 text-2xl text-amber-500 mb-2 mt-1">
                                ⭐⭐⭐⭐⭐
                            </span>
                            <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{t('trust.clientSatisfaction')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why LASS Realty - Market Expertise & Case Studies */}
            <WhyLassRealty />

            {/* Featured Properties Container */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{t('featured.title')}</h2>
                            <p className="text-slate-600 max-w-2xl">{t('featured.subtitle')}</p>
                        </div>
                        <Link href="/properties" className="hidden sm:flex text-slate-900 font-semibold items-center hover:text-amber-600 transition-colors">
                            {t('featured.viewAll')} <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>

                    <PropertyGrid properties={featuredProperties} />

                    <div className="mt-12 text-center sm:hidden">
                        <Link href="/properties" className="inline-flex items-center text-slate-900 font-semibold hover:text-amber-600 transition-colors">
                            {t('featured.viewAllLong')} <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{t('testimonials.title')}</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                            <span className="text-5xl text-amber-200 absolute top-4 left-6">&quot;</span>
                            <p className="text-slate-700 italic relative z-10 mb-6 mt-4">{t('testimonials.t1.quote')}</p>
                            <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">MR</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Michael R.</h4>
                                    <p className="text-sm text-slate-500">{t('testimonials.t1.role')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                            <span className="text-5xl text-amber-200 absolute top-4 left-6">&quot;</span>
                            <p className="text-slate-700 italic relative z-10 mb-6 mt-4">{t('testimonials.t2.quote')}</p>
                            <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">SJ</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Sarah Jenks</h4>
                                    <p className="text-sm text-slate-500">{t('testimonials.t2.role')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative md:hidden lg:block">
                            <span className="text-5xl text-amber-200 absolute top-4 left-6">&quot;</span>
                            <p className="text-slate-700 italic relative z-10 mb-6 mt-4">{t('testimonials.t3.quote')}</p>
                            <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">DT</div>
                                <div>
                                    <h4 className="font-bold text-slate-900">David T.</h4>
                                    <p className="text-sm text-slate-500">{t('testimonials.t3.role')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Locations Mesh Section */}
            <section id="locations" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{t('locations.title')}</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">{t('locations.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {LOCATIONS.filter(loc => loc.priority).slice(0, 4).map((location) => (
                            <Link
                                key={location.slug}
                                href={`/locations/${location.slug}`}
                                className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all duration-300 text-center"
                            >
                                <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                                    <MapPin className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{location.name}</h3>
                                <div className="text-slate-500 text-sm">{t('locations.viewProperties')}</div>
                            </Link>
                        ))}
                    </div>

                    {/* Interactive Luxury Map */}
                    <div className="mt-16 bg-navy-900 rounded-[2.5rem] p-4 sm:p-6 lg:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-champagne-500/10 to-transparent pointer-events-none" />
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-champagne-500/20 blur-[100px] pointer-events-none rounded-full" />

                        <div className="relative z-10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="text-champagne-500 font-bold uppercase tracking-widest text-sm mb-2">{t('locations.mapSubtitle', { fallback: 'Explore the Map' })}</div>
                                <h3 className="text-3xl font-playfair font-bold text-white">{t('locations.mapTitle', { fallback: 'Dominican Republic Real Estate' })}</h3>
                            </div>
                            <Link href="/properties" className="text-champagne-400 font-bold hover:text-white transition-colors flex items-center gap-2">
                                {t('locations.viewFullMap', { fallback: 'View Full Map' })} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <PropertyMap properties={featuredProperties} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
