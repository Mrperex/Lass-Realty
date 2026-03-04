'use client';

import { useState, useEffect } from 'react';
import { X, Map, DownloadCloud } from 'lucide-react';
import { sendGAEvent } from '@next/third-parties/google';

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Only trigger once per session
        if (sessionStorage.getItem('exit_intent_triggered')) {
            setHasTriggered(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            // Detect if the mouse moves up toward the tab bar/address bar
            if (e.clientY <= 0 && !hasTriggered) {
                setIsVisible(true);
                setHasTriggered(true);
                sessionStorage.setItem('exit_intent_triggered', 'true');
                sendGAEvent({ event: 'exit_intent_triggered' });
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closePopup();
        };

        // Desktop exit intent
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [hasTriggered]);

    const closePopup = () => {
        setIsVisible(false);
        sendGAEvent({ event: 'exit_intent_dismissed' });
    };

    const handleDownload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Lead Magnet Download',
                    email,
                    phone: 'N/A',
                    message: '[LEAD MAGNET] - Requested the Free Punta Cana Buyer\'s Guide.',
                }),
            });

            setSuccess(true);
            sendGAEvent({ event: 'lead_magnet_download', email_captured: true });
        } catch (error) {
            console.error('Failed to capture lead:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300 font-outfit">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors backdrop-blur-md border border-slate-200/50"
                    aria-label="Close popup"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Visual/Context */}
                <div className="md:w-5/12 bg-champagne-500 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613490900233-a3d82db45e8e?auto=format&fit=crop&w=600&h=800&q=80')] bg-cover bg-center opacity-20 mix-blend-multiply transition-transform duration-1000 hover:scale-110"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-champagne-500/80 to-champagne-600/90"></div>

                    <Map className="w-16 h-16 text-navy-900 mb-6 relative z-10 opacity-90" />
                    <h3 className="font-cormorant font-bold text-navy-900 text-3xl mb-4 relative z-10 leading-tight">Wait! Before You Go...</h3>
                    <p className="text-navy-900/80 text-sm font-medium relative z-10">
                        Don't buy in the Dominican Republic without reading this first.
                    </p>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-slate-50">
                    {success ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <DownloadCloud className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="font-cormorant font-bold text-navy-900 text-2xl">Guide Sent!</h4>
                            <p className="text-slate-600 text-sm">
                                Check your email inbox. The exclusive Punta Cana Buyer's Guide is on its way.
                            </p>
                            <button
                                onClick={closePopup}
                                className="mt-4 px-6 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors text-sm"
                            >
                                Close & Continue Browsing
                            </button>
                        </div>
                    ) : (
                        <>
                            <h4 className="font-cormorant font-bold text-navy-900 text-2xl mb-3">Download the Free Punta Cana Buyer's Guide</h4>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                Get exclusive insights, legal requirements for foreigners, and ROI breakdowns before investing in Caribbean real estate.
                            </p>

                            <form onSubmit={handleDownload} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-champagne-500 outline-none text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-4 bg-navy-900 text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-champagne-500 hover:text-navy-900 transition-all shadow-[0_4px_14px_rgba(10,17,40,0.3)] disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Sending...' : 'Get Instant Access'}
                                </button>
                                <p className="text-xs text-slate-400 text-center mt-3">
                                    100% Free. We respect your privacy.
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
