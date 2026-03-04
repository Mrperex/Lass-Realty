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
import WhyLassRealty from '@/components/WhyLassRealty';
import Hero from '@/components/Hero';

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
            <Hero />

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
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200">
                                    <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256" alt="Michael R." fill className="object-cover" sizes="48px" />
                                </div>
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
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200">
                                    <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256" alt="Sarah Jenks" fill className="object-cover" sizes="48px" />
                                </div>
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
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200">
                                    <Image src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256" alt="David T." fill className="object-cover" sizes="48px" />
                                </div>
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
                </div>
            </section>
        </div>
    );
}
