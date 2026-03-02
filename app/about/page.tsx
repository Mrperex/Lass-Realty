import Image from 'next/image';
import { ShieldCheck, Award, MapPin, CheckCircle } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata = {
    title: 'About Us | LASS Realty',
    description: 'Learn about LASS Realty, your trusted luxury real estate partner in the Dominican Republic. Discover our story, local authority, and commitment to excellence.',
};

export default function AboutPage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center bg-slate-900">
                <div className="absolute inset-0 bg-slate-900/60 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09be1587?auto=format&fit=crop&q=80"
                    alt="Luxury Dominican Republic Real Estate"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        Your Trusted Partner in Paradise
                    </h1>
                    <p className="text-xl text-slate-200 max-w-2xl mx-auto font-light drop-shadow">
                        We don&apos;t just sell properties. We navigate the complexities of international real estate so you can acquire your dream lifestyle with total peace of mind.
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Local Authority. Global Standards.</h2>
                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-light">
                            <p>
                                Founded on the principles of absolute transparency and elite service, LASS Realty has grown into the Dominican Republic&apos;s most reliable luxury real estate boutique.
                            </p>
                            <p>
                                Buying international property requires deep local knowledge and unshakeable trust. Our team holds over 15 years of combined experience exclusively in the Punta Cana, Cap Cana, and Bavaro markets. We understand the legal frameworks, the developer histories, and the neighborhood micro-economies.
                            </p>
                            <p>
                                Whether you are searching for a high-yield investment condo or a sweeping oceanfront estate, our commitment remains the same: protecting your capital and delivering a frictionless acquisition experience.
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-amber-100 p-2 rounded-lg"><ShieldCheck className="w-6 h-6 text-amber-600" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Legal Security</h4>
                                    <p className="text-sm text-slate-500 mt-1">We partner with top local attorneys for Title validation.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-amber-100 p-2 rounded-lg"><MapPin className="w-6 h-6 text-amber-600" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Market Insight</h4>
                                    <p className="text-sm text-slate-500 mt-1">Exclusive access to off-market luxury pockets.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
                                alt="Real Estate Professional"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block">
                            <div className="flex items-center gap-4 mb-4">
                                <Award className="w-10 h-10 text-amber-500" />
                                <div>
                                    <div className="text-3xl font-bold text-slate-900">$100M+</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Turnover</div>
                                </div>
                            </div>
                            <div className="text-slate-600 font-medium border-t border-slate-100 pt-4">
                                Recognized as a Top 10 Luxury Brokerage <br /> in the Dominican Republic (2025).
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">Why Buyers Trust Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="bg-slate-50 p-8 rounded-2xl">
                            <CheckCircle className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Vetted Inventory</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">We reject 40% of the properties we review. We only list homes with pristine legal standing.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl">
                            <CheckCircle className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="font-bold text-slate-900 text-lg mb-2">End-to-End Service</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">From viewing to closing to property management, we handle the entire lifecycle.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl">
                            <CheckCircle className="w-8 h-8 text-amber-500 mb-4" />
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Foreign Buyer Experts</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Specializing in US, Canadian, and European investors buying in the DR.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
