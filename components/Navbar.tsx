import Link from 'next/link';

const Navbar = () => {
    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900">
                            LASS <span className="font-light">Realty</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-slate-600 hover:text-amber-600 font-bold transition-colors">
                            Home
                        </Link>
                        <Link href="/properties" className="text-slate-600 hover:text-amber-600 font-bold transition-colors">
                            Properties
                        </Link>
                        {/* Locations dropdown or link. We'll use a direct link to a locations overview or just /properties for now. Wait, there's no /locations page yet? 
                            Let's link to the first priority location or a #locations anchor. The homepage has a "Browse by Location" section.
                            Let's use an anchor link to #locations. */}
                        <a href="/#locations" className="text-slate-600 hover:text-amber-600 font-bold transition-colors">
                            Locations
                        </a>
                        <Link href="/contact" className="text-slate-600 hover:text-amber-600 font-bold transition-colors">
                            Contact
                        </Link>
                    </nav>
                    <div className="md:hidden">
                        <span className="text-slate-600 font-medium">Menu</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
