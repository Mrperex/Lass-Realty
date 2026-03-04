"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Playfair_Display, Outfit } from 'next/font/google';
import {
    LayoutDashboard, Building2,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    Map
} from 'lucide-react';
import '../../globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-cormorant' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return (
            <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
                <body className="font-outfit antialiased bg-slate-50">
                    {children}
                </body>
            </html>
        );
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Properties', href: '/admin/properties', icon: Building2 },
        { name: 'Leads CRM', href: '/admin/leads', icon: Users },
        { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
        { name: 'Neighborhoods', href: '/admin/neighborhoods', icon: Map },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
            <body className="font-outfit antialiased">
                <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800">
                        <div className="p-6">
                            <Link href="/" className="text-xl font-bold text-white tracking-tight hover:text-amber-500 transition-colors">
                                LASS Realty
                                <span className="block text-xs font-normal text-amber-500 tracking-widest uppercase mt-1">Admin Portal</span>
                            </Link>
                        </div>

                        <nav className="flex-1 px-4 space-y-2 mt-4">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                            ? 'bg-amber-600 text-white shadow-md'
                                            : 'hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 mt-auto">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
