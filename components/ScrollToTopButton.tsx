'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled vertically by over 300px
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 hidden md:block">
            <button
                type="button"
                onClick={scrollToTop}
                className={`p-3 bg-champagne-500 text-navy-900 rounded-full shadow-[0_4px_14px_rgba(212,175,55,0.4)] hover:bg-champagne-400 hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
        </div>
    );
}
