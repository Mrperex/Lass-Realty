'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, FileText, X, Loader2, CheckCircle2 } from 'lucide-react';

interface Report {
    id: string;
    title: string;
    title_es: string;
    description: string;
    description_es: string;
    coverImage: string;
    pages: number;
    category: string;
    category_es: string;
}

export default function ReportCard({ report, locale }: { report: Report; locale: string }) {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const isEs = locale === 'es';
    const title = isEs && report.title_es ? report.title_es : report.title;
    const description = isEs && report.description_es ? report.description_es : report.description;
    const category = isEs && report.category_es ? report.category_es : report.category;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/report-download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, reportId: report.id }),
            });

            if (!res.ok) throw new Error('Failed to submit');

            setSuccess(true);

            // Auto-close after 3 seconds
            setTimeout(() => {
                setShowModal(false);
                setSuccess(false);
                setName('');
                setEmail('');
            }, 4000);
        } catch {
            setError(isEs ? 'Error al enviar. Intente de nuevo.' : 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Card */}
            <div className="group bg-white flex flex-col h-full shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <Image
                        src={report.coverImage}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-[#0a1128]/90 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase px-3 py-1 font-outfit">
                            {category}
                        </span>
                    </div>
                    {/* PDF icon */}
                    <div className="absolute bottom-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                            <FileText className="w-5 h-5 text-[#0a1128]" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-playfair font-medium text-[#0a1128] mb-3 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                        {title}
                    </h3>

                    <p className="text-gray-600 font-outfit text-sm line-clamp-3 mb-4 flex-1">
                        {description}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-outfit">
                            {report.pages} {isEs ? 'páginas' : 'pages'} • PDF
                        </span>

                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-[#0a1128] hover:bg-[#121e3f] text-white px-4 py-2 text-sm font-outfit font-semibold uppercase tracking-wider transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {isEs ? 'Descargar' : 'Download'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Capture Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div
                        className="bg-white w-full max-w-md shadow-2xl relative animate-in fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {success ? (
                            /* Success State */
                            <div className="p-10 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-playfair font-medium text-[#0a1128] mb-3">
                                    {isEs ? '¡Descarga Lista!' : 'Download Ready!'}
                                </h3>
                                <p className="text-gray-600 font-outfit text-sm mb-6">
                                    {isEs
                                        ? 'Revise su correo electrónico. También le hemos enviado el enlace de descarga.'
                                        : 'Check your email. We\'ve also sent you the download link.'}
                                </p>
                                <p className="text-xs text-gray-400 font-outfit">
                                    {isEs ? 'Un agente de LASS Realty se comunicará pronto.' : 'A LASS Realty agent will be in touch soon.'}
                                </p>
                            </div>
                        ) : (
                            /* Form State */
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="w-6 h-6 text-[#d4af37]" />
                                    <span className="text-xs font-outfit font-semibold text-[#d4af37] uppercase tracking-wider">
                                        {isEs ? 'Informe Gratuito' : 'Free Report'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-playfair font-medium text-[#0a1128] mb-2">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-500 font-outfit mb-6">
                                    {isEs
                                        ? 'Ingrese sus datos para recibir el informe en su correo electrónico.'
                                        : 'Enter your details to receive the report in your inbox.'}
                                </p>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-1">
                                            {isEs ? 'Nombre completo' : 'Full name'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={isEs ? 'Ej: Carlos García' : 'e.g. John Smith'}
                                            className="w-full px-4 py-3 border border-gray-200 text-gray-900 font-outfit text-sm focus:border-[#0a1128] focus:ring-1 focus:ring-[#0a1128] outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-1">
                                            {isEs ? 'Correo electrónico' : 'Email address'}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={isEs ? 'su@correo.com' : 'you@email.com'}
                                            className="w-full px-4 py-3 border border-gray-200 text-gray-900 font-outfit text-sm focus:border-[#0a1128] focus:ring-1 focus:ring-[#0a1128] outline-none transition-colors"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm font-outfit">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#0a1128] hover:bg-[#121e3f] text-white py-3 font-outfit font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {isEs ? 'Procesando...' : 'Processing...'}
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                {isEs ? 'Descargar Informe Gratis' : 'Download Free Report'}
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-400 font-outfit text-center">
                                        🔒 {isEs
                                            ? 'Su información está segura. Sin spam.'
                                            : 'Your information is secure. No spam.'}
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
