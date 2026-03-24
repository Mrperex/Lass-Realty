'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';
import SearchFilters from '@/components/SearchFilters';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Hero background — static image for instant LCP, no video download needed
const HERO_IMG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=60&w=1280';

export default function Hero() {
    const t = useTranslations('Index');
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start']
    });

    const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scaleText = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
    };
    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 50, damping: 18 } }
    };

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden bg-navy-900">
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/30 to-navy-900/90 z-10" />

            {/* ── LCP Background: priority Image for instant paint ── */}
            <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full z-0 origin-top">
                <Image
                    src={HERO_IMG}
                    alt="Luxury villa in Punta Cana"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                    quality={55}
                    className="object-cover scale-105"
                />
            </motion.div>

            {/* Hero Text Content */}
            <motion.div
                style={{ opacity: opacityText, scale: scaleText }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-20 text-center px-4 max-w-6xl mx-auto flex flex-col items-center justify-end flex-grow w-full pt-20"
            >
                <motion.div variants={itemVariants} className="overflow-hidden mb-6">
                    <span className="inline-block text-champagne-500 font-bold tracking-[0.3em] uppercase text-xs md:text-sm drop-shadow-md border border-champagne-500/30 px-6 py-2 rounded-full bg-navy-900/30 backdrop-blur-sm">
                        {t('subtitle', { fallback: 'Dominican Republic Real Estate' })}
                    </span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="font-playfair text-5xl md:text-7xl lg:text-8xl xl:text-[7rem] font-medium text-white mb-8 tracking-tight drop-shadow-2xl leading-[1.2] max-w-4xl">
                    Own The <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-champagne-300 via-champagne-500 to-champagne-400 pr-2 pb-6">Extraordinary</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-200 mb-8 max-w-2xl mx-auto font-light drop-shadow-lg leading-relaxed mix-blend-screen">
                    {t('description', { fallback: 'Exclusive oceanfront villas, luxury condos, and private estates in Punta Cana, Cap Cana, and beyond.' })}
                </motion.p>
            </motion.div>

            {/* Search Engine Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-30 text-center px-4 max-w-6xl mx-auto flex flex-col items-center justify-start flex-grow w-full mt-4"
            >
                <motion.div variants={itemVariants} className="w-full max-w-5xl mx-auto hidden sm:block">
                    <div className="bg-white/10 backdrop-blur-2xl p-3 rounded-[2rem] border border-white/20 shadow-2xl relative">
                        <div className="absolute inset-0 bg-champagne-500/10 rounded-[2rem] blur-xl -z-10"></div>
                        <SearchFilters />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:hidden w-full gap-4 justify-center mt-8">
                    <Link
                        href="/properties"
                        className="inline-flex items-center justify-center bg-champagne-500 text-navy-900 w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-champagne-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
                    >
                        {t('explore', { fallback: 'Explore Properties' })}
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
