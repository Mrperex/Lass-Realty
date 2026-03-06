"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Fingerprint, RefreshCcw, Loader2 } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('admin@lassrealty.com');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [webAuthnLoading, setWebAuthnLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid password');
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleWebAuthnLogin = async () => {
        setWebAuthnLoading(true);
        setError('');
        setMessage('');
        try {
            const resOpts = await fetch('/api/auth/webauthn/generate-authentication-options');
            if (!resOpts.ok) throw new Error('Biometric auth not set up');

            const options = await resOpts.json();
            const asseResp = await startAuthentication(options);

            const resVerify = await fetch('/api/auth/webauthn/verify-authentication', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(asseResp),
            });

            if (resVerify.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                throw new Error('Biometrics not matched');
            }
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                setError('Biometric authentication closed.');
            } else {
                setError(err.message || 'FaceID / TouchID failed');
            }
        } finally {
            setWebAuthnLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            setMessage(data.message || 'If an account exists, a reset link was sent.');
        } catch (err) {
            setError('Failed to request reset');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Access</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        LASS Realty Management Portal
                    </p>
                </div>

                {showForgot ? (
                    <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                        <div className="text-center text-sm text-slate-600 mb-4">
                            Enter your email address to receive a password reset link.
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 bg-green-50 text-green-800 rounded-xl border border-green-200 text-sm text-center">
                                {message}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={resetLoading}
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow disabled:opacity-50"
                                placeholder="Admin Email"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-amber-600 transition-colors shadow flex items-center justify-center disabled:opacity-50"
                            >
                                {resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowForgot(false); setError(''); setMessage(''); }}
                                className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow disabled:opacity-50"
                                    placeholder="Enter admin email"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow disabled:opacity-50"
                                    placeholder="Enter master password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => { setShowForgot(true); setError(''); setMessage(''); }}
                                className="text-sm font-medium text-amber-600 hover:text-amber-500 focus:outline-none"
                            >
                                Forgot your password?
                            </button>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleWebAuthnLogin}
                                disabled={webAuthnLoading || loading}
                                className="w-full flex justify-center items-center py-3 px-4 border shadow-sm text-sm font-bold rounded-xl text-navy-900 bg-white hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 gap-2"
                            >
                                {webAuthnLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Fingerprint className="w-5 h-5 text-amber-600" />
                                        Sign in with Face ID / Touch ID
                                    </>
                                )}
                            </button>

                            <button
                                type="submit"
                                disabled={loading || webAuthnLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-amber-600 transition-all duration-300 shadow flex items-center justify-center disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin border-t-white" />
                                ) : (
                                    'Sign In with Password'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
