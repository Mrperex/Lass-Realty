"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
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

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

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
                            className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm transition-shadow disabled:opacity-50"
                            placeholder="Enter master password"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <span className="inline-block h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
