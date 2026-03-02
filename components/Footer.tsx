import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">LASS Realty</h3>
                        <p className="text-sm">
                            Your premier destination for luxury real estate and exclusive properties.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/properties" className="hover:text-white transition-colors">Properties</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-md font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-2 text-sm">
                            <li>info@lassrealty.com</li>
                            <li>+1 (555) 123-4567</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
                    &copy; {new Date().getFullYear()} LASS Realty. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
