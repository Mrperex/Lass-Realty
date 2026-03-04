import { useTranslations } from 'next-intl';
import { Award, ShieldCheck, Key, TrendingUp, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export default function WhyLassRealty() {
    const t = useTranslations('Index.whyLass');

    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-navy-900 mb-6 leading-tight">
                        {t('title', { fallback: 'Why Choose LASS Realty?' })}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
                        {t('subtitle', { fallback: 'Unmatched market expertise, absolute discretion, and a proven track record in luxury acquisitions.' })}
                    </p>
                </motion.div>

                {/* Expertise Pillars */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
                >
                    {/* Pillar 1 */}
                    <motion.div variants={fadeUpVariants} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-champagne-200 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-champagne-50 transition-all duration-300">
                            <Award className="w-7 h-7 text-champagne-600" />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 mb-4">{t('expertise.title')}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('expertise.desc')}
                        </p>
                    </motion.div>

                    {/* Pillar 2 */}
                    <motion.div variants={fadeUpVariants} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-champagne-200 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-champagne-50 transition-all duration-300">
                            <ShieldCheck className="w-7 h-7 text-champagne-600" />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 mb-4">{t('legal.title')}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('legal.desc')}
                        </p>
                    </motion.div>

                    {/* Pillar 3 */}
                    <motion.div variants={fadeUpVariants} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:border-champagne-200 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-champagne-50 transition-all duration-300">
                            <Key className="w-7 h-7 text-champagne-600" />
                        </div>
                        <h3 className="text-xl font-bold text-navy-900 mb-4">{t('management.title')}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('management.desc')}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Case Studies */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUpVariants}
                    className="bg-navy-900 rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-champagne-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-champagne-500/20 blur-[100px] pointer-events-none rounded-full" />

                    <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="lg:w-1/3">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-champagne-400 font-bold text-sm tracking-widest uppercase mb-6 backdrop-blur-md border border-white/5">
                                <TrendingUp className="w-4 h-4" /> Case Studies
                            </div>
                            <h3 className="text-4xl text-white font-cormorant font-bold mb-6 leading-tight">
                                {t('caseStudies.title')}
                            </h3>
                            <div className="space-y-4 text-slate-300">
                                <p>We don&apos;t just list properties; we engineer high-value acquisitions.</p>
                            </div>
                        </div>

                        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Case Study 1 */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <h4 className="text-xl font-bold text-white leading-tight">
                                        {t('caseStudies.cs1.title')}
                                    </h4>
                                    <CheckCircle2 className="w-6 h-6 text-champagne-500 shrink-0" />
                                </div>
                                <div className="text-3xl font-bold text-champagne-400 mb-4 font-outfit">
                                    {t('caseStudies.cs1.roi')}
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {t('caseStudies.cs1.desc')}
                                </p>
                            </div>

                            {/* Case Study 2 */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <h4 className="text-xl font-bold text-white leading-tight">
                                        {t('caseStudies.cs2.title')}
                                    </h4>
                                    <CheckCircle2 className="w-6 h-6 text-champagne-500 shrink-0" />
                                </div>
                                <div className="text-3xl font-bold text-champagne-400 mb-4 font-outfit">
                                    {t('caseStudies.cs2.roi')}
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {t('caseStudies.cs2.desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
