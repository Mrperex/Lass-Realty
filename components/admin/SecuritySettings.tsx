'use client';

import { useState } from 'react';
import { Shield, Key, Fingerprint, Loader2 } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';

export default function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passLoading, setPassLoading] = useState(false);
    const [passMessage, setPassMessage] = useState('');
    const [passError, setPassError] = useState('');

    const [webAuthnLoading, setWebAuthnLoading] = useState(false);
    const [webAuthnMessage, setWebAuthnMessage] = useState('');
    const [webAuthnError, setWebAuthnError] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassError('');
        setPassMessage('');

        if (newPassword !== confirmPassword) {
            setPassError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setPassError('Password must be at least 6 characters long');
            return;
        }

        setPassLoading(true);
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();

            if (res.ok) {
                setPassMessage('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setPassError(data.error || 'Failed to change password');
            }
        } catch (err) {
            setPassError('An unexpected error occurred');
        } finally {
            setPassLoading(false);
        }
    };

    const handleRegisterWebAuthn = async () => {
        setWebAuthnError('');
        setWebAuthnMessage('');
        setWebAuthnLoading(true);

        try {
            // 1. Get options from server
            const resOpts = await fetch('/api/auth/webauthn/generate-registration-options');
            if (!resOpts.ok) {
                const data = await resOpts.json();
                throw new Error(data.error || 'Failed to get registration options');
            }
            const options = await resOpts.json();

            // 2. Start registration in browser
            const attResp = await startRegistration(options);

            // 3. Send response to server to verify
            const resVerify = await fetch('/api/auth/webauthn/verify-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attResp),
            });

            const verification = await resVerify.json();

            if (resVerify.ok && verification.success) {
                setWebAuthnMessage('Face ID / Touch ID registered successfully!');
            } else {
                setWebAuthnError(verification.error || 'Failed to verify registration');
            }
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                setWebAuthnError('Registration cancelled or blocked by browser');
            } else {
                setWebAuthnError(err.message || 'An unexpected error occurred');
            }
        } finally {
            setWebAuthnLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-sm p-8 border border-gray-100 mt-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-100 rounded-xl">
                    <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-lg font-semibold text-navy-900">Security & Access</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Change Password Form */}
                <div>
                    <h3 className="text-md font-medium text-navy-900 mb-4 flex items-center gap-2">
                        <Key className="w-4 h-4 text-slate-400" /> Change Master Password
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {passMessage && <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100">{passMessage}</div>}
                        {passError && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{passError}</div>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-shadow"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={passLoading}
                            className="w-full py-2.5 bg-navy-900 text-white rounded-xl hover:bg-amber-600 transition-colors flex justify-center items-center disabled:opacity-50 font-medium"
                        >
                            {passLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Biometric Auth */}
                <div>
                    <h3 className="text-md font-medium text-navy-900 mb-4 flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-slate-400" /> Biometric Authentication
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Register your device's Face ID, Touch ID, or Windows Hello to quickly and securely sign in without needing your master password.
                    </p>

                    {webAuthnMessage && <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100 mb-4">{webAuthnMessage}</div>}
                    {webAuthnError && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 mb-4">{webAuthnError}</div>}

                    <button
                        onClick={handleRegisterWebAuthn}
                        disabled={webAuthnLoading}
                        className="w-full py-3 border border-slate-200 text-navy-900 rounded-xl hover:bg-slate-50 transition-colors flex justify-center items-center disabled:opacity-50 font-medium gap-2 shadow-sm"
                    >
                        {webAuthnLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        ) : (
                            <>
                                <Fingerprint className="w-5 h-5 text-amber-600" />
                                Register Device / Passkey
                            </>
                        )}
                    </button>

                    <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                        <strong>Note:</strong> Passkeys are tied to your current device and browser profile. If you clear your browser data or use a different device, you will need to sign in with your master password and register that device.
                    </div>
                </div>
            </div>
        </div>
    );
}
