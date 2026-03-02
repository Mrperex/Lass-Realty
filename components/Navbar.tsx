'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-bold tracking-tighter text-slate-900">
                            LASS <span className="font-light">Realty</span>
                        </Link>
                    </div>
                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-slate-600 hover:text-amber-600 font-bold transition-colors">Home</Link>
                        <Link href="/properties" className="text-slate-600 hover:text-amber-600 font-bold transition-colors">Properties</Link>
                        <Link href="/#locations" className="text-slate-600 hover:text-amber-600 font-bold transition-colors">Locations</Link>
                        <Link href="/contact" className="text-slate-600 hover:text-amber-600 font-bold transition-colors">Contact</Link>
                    </nav>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-amber-600 focus:outline-none p-2" aria-label="Toggle menu">
                            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-t border-slate-100 py-6 flex flex-col px-8 gap-6 z-50">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">Home</Link>
                    <Link href="/properties" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">Properties</Link>
                    <Link href="/#locations" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">Locations</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className="text-xl text-slate-800 font-bold hover:text-amber-600">Contact</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
