"use client";

import { FormEvent, useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { useTranslations } from 'next-intl';

export default function ContactForm({ propertySlug }: { propertySlug: string }) {
    const t = useTranslations('PropertyContactForm');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const form = e.currentTarget;
        const data = new FormData(form);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(data)),
            });

            if (res.ok) {
                setSuccess(true);
                sendGAEvent({ event: 'lead_submit', property_slug: propertySlug });
                form.reset();
            } else {
                const result = await res.json();
                setError(result.error || t('failedToSend'));
            }
        } catch (err: any) {
            setError(err.message || t('errorOccurred'));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-6 bg-green-50 text-green-800 rounded-xl border border-green-200">
                <h4 className="text-lg font-bold mb-2">{t('messageSent')}</h4>
                <p className="text-sm">{t('thankYou')}</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-sm font-medium text-green-900 underline underline-offset-2 hover:text-green-700"
                >
                    {t('sendAnother')}
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <input type="hidden" name="propertySlug" value={propertySlug} />

            {/* Honeypot Spam Protection */}
            <div className="hidden" aria-hidden="true">
                <input type="text" name="bot_field_website" tabIndex={-1} autoComplete="off" />
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('fullName')}</label>
                <input type="text" id="name" name="name" required disabled={loading} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow text-slate-900 disabled:opacity-50" placeholder={t('namePlaceholder')} />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('emailAddress')}</label>
                <input type="email" id="email" name="email" required disabled={loading} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow text-slate-900 disabled:opacity-50" placeholder={t('emailPlaceholder')} />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('phoneNumber')} <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="tel" id="phone" name="phone" disabled={loading} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow text-slate-900 disabled:opacity-50" placeholder={t('phonePlaceholder')} />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('messageField')}</label>
                <textarea id="message" name="message" rows={4} required disabled={loading} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow text-slate-900 resize-none disabled:opacity-50" placeholder={t('messagePlaceholder')}></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-amber-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-slate-900 disabled:hover:shadow-none flex items-center justify-center">
                {loading ? (
                    <span className="inline-block h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                    t('submitButton')
                )}
            </button>
        </form>
    );
}
