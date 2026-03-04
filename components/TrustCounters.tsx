'use client';

import { useEffect, useState, useRef } from 'react';
import { Home, Globe2, Award, Briefcase } from 'lucide-react';

const stats = [
    {
        id: 1,
        name: 'Properties Sold',
        value: 1240,
        prefix: '',
        suffix: '+',
        icon: Home,
        description: 'Luxury homes closed across the Dominican Republic.'
    },
    {
        id: 2,
        name: 'Total Volume',
        value: 500,
        prefix: '$',
        suffix: 'M+',
        icon: Briefcase,
        description: 'In real estate transactions handled securely.'
    },
    {
        id: 3,
        name: 'Global Clients',
        value: 45,
        prefix: '',
        suffix: '',
        icon: Globe2,
        description: 'Countries represented by our international buyers.'
    },
    {
        id: 4,
        name: 'Years Experience',
        value: 15,
        prefix: '',
        suffix: '+',
        icon: Award,
        description: 'Of trusted market leadership in Punta Cana.'
    }
];

export default function TrustCounters() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-navy-900 border-t border-white/10 relative overflow-hidden font-outfit">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full flex justify-center items-center opacity-5 pointer-events-none">
                <div className="w-[800px] h-[800px] bg-champagne-500 rounded-full blur-[150px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-champagne-400 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Proven Track Record</span>
                    <h2 className="text-4xl md:text-5xl font-cormorant font-medium text-offwhite mb-6">Numbers That Speak Volumes</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto font-light text-lg">
                        LASS Realty represents the pinnacle of luxury real estate representation in the Caribbean. Our results reflect our dedication to closing extraordinary deals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.id}
                            className={`flex flex-col items-center text-center p-8 rounded-3xl bg-navy-800/50 border border-white/5 backdrop-blur-sm transition-all duration-700
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                            `}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="w-16 h-16 rounded-full bg-champagne-500/10 flex items-center justify-center mb-6">
                                <stat.icon className="w-8 h-8 text-champagne-400" />
                            </div>
                            <div className="flex items-baseline mb-2">
                                <span className="text-4xl md:text-5xl font-cormorant font-bold text-offwhite">
                                    {stat.prefix}
                                    {/* Simplistic counter effect could go here, for now static looks extremely premium */}
                                    {stat.value}
                                    {stat.suffix}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-200 mb-3 tracking-wide">{stat.name}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
