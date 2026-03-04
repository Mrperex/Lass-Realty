import { Settings, Globe, Bell, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-light text-navy-900 mb-2">Settings</h1>
                <p className="text-gray-500">Configure site preferences and integrations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white shadow-sm p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-100 rounded-xl">
                            <Settings className="w-5 h-5 text-slate-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-navy-900">General</h2>
                    </div>
                    <div className="space-y-4 text-sm text-gray-600">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Site Name</span>
                            <span className="font-medium text-navy-900">LASS Realty</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Domain</span>
                            <span className="font-medium text-navy-900">lasspuntacana.com</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Currency</span>
                            <span className="font-medium text-navy-900">USD (primary)</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span>Platform</span>
                            <span className="font-medium text-navy-900">Next.js 14 + Vercel</span>
                        </div>
                    </div>
                </div>

                {/* Localization */}
                <div className="bg-white shadow-sm p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-100 rounded-xl">
                            <Globe className="w-5 h-5 text-slate-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-navy-900">Localization</h2>
                    </div>
                    <div className="space-y-4 text-sm text-gray-600">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Default Language</span>
                            <span className="font-medium text-navy-900">English (EN)</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Supported Languages</span>
                            <span className="font-medium text-navy-900">EN, ES</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span>Translation System</span>
                            <span className="font-medium text-navy-900">next-intl</span>
                        </div>
                    </div>
                </div>

                {/* Integrations */}
                <div className="bg-white shadow-sm p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-100 rounded-xl">
                            <Bell className="w-5 h-5 text-slate-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-navy-900">Integrations</h2>
                    </div>
                    <div className="space-y-4 text-sm text-gray-600">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Image Host</span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Connected — Cloudinary</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Database</span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Connected — MongoDB</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Cache</span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Connected — Upstash Redis</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span>Analytics</span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Active — PostHog</span>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white shadow-sm p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-100 rounded-xl">
                            <Shield className="w-5 h-5 text-slate-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-navy-900">Security</h2>
                    </div>
                    <div className="space-y-4 text-sm text-gray-600">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Authentication</span>
                            <span className="font-medium text-navy-900">JWT Token</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>Rate Limiting</span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Active</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span>CSRF Protection</span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Active</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span>SSL/HSTS</span>
                            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Enforced</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
