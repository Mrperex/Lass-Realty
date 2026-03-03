'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        id: 1,
        name: 'James & Sarah Thornton',
        location: 'Toronto, Canada',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
        quote: "Purchasing a beachfront villa entirely remotely felt daunting, but LASS Realty's concierge service managed every legal and structural detail flawlessly. Our dream home in Cap Cana is absolutely perfect.",
        rating: 5
    },
    {
        id: 2,
        name: 'Marcus Vandenberg',
        location: 'Miami, USA',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
        quote: "The ROI analysis and deep market knowledge they brought to the table on European investments was unmatched. I've transacted three luxury condos through them in the last two years.",
        rating: 5
    },
    {
        id: 3,
        name: 'Elena Rostova',
        location: 'London, UK',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
        quote: "They don't just sell real estate; they curate a lifestyle. The private showings were impeccably organized, and their negotiation secured us a spectacular ocean-view estate below market value.",
        rating: 5
    }
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden font-outfit">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Context & Google Reviews */}
                    <div>
                        <span className="text-champagne-600 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Client Success Stories</span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-medium text-navy-900 mb-6 leading-tight">Trusted By The World&apos;s <span className="italic">Elite</span></h2>
                        <p className="text-slate-600 mb-10 text-lg leading-relaxed font-light">
                            Our reputation is built entirely on the success and absolute discretion we provide our clients. Read what international buyers have to say about their experience with LASS Realty.
                        </p>

                        {/* Google Reviews Badge */}
                        <div className="flex items-center gap-4 p-4 rounded-full bg-white border border-slate-200 shadow-sm inline-flex">
                            <div className="flex items-center gap-1 text-champagne-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-navy-900">4.9/5</span>
                                <span className="text-slate-500 text-sm">from 150+ Google Reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Carousel */}
                    <div className="relative">
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10 pointer-events-none">
                            <Quote className="w-48 h-48 text-navy-900" />
                        </div>

                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 relative z-10 transition-all duration-500 min-h-[400px] flex flex-col justify-between">

                            <div
                                className="transition-opacity duration-500 ease-in-out animate-in fade-in"
                                key={currentIndex} // Forces re-render animation just for the content
                            >
                                <div className="flex gap-1 text-champagne-500 mb-6">
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-xl md:text-2xl font-playfair text-navy-900 leading-snug mb-8">
                                    &quot;{testimonials[currentIndex].quote}&quot;
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-champagne-200">
                                        <Image
                                            src={testimonials[currentIndex].image}
                                            alt={testimonials[currentIndex].name}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-900">{testimonials[currentIndex].name}</h4>
                                        <p className="text-slate-500 text-sm">{testimonials[currentIndex].location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Carousel Controls (Static!) */}
                            <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-6">
                                <button
                                    onClick={prevTestimonial}
                                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-navy-900 hover:bg-champagne-50 hover:border-champagne-300 transition-colors"
                                    aria-label="Previous testimonial"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextTestimonial}
                                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-navy-900 hover:bg-champagne-50 hover:border-champagne-300 transition-colors"
                                    aria-label="Next testimonial"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
