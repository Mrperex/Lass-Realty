'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only run on desktop
        if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
            setIsVisible(true);

            const updateCursorPosition = (e: MouseEvent) => {
                setPosition({ x: e.clientX, y: e.clientY });
            };

            const handleMouseOver = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                // Check if the target is clickable or part of a clickable element
                if (
                    target.tagName.toLowerCase() === 'a' ||
                    target.tagName.toLowerCase() === 'button' ||
                    target.closest('a') ||
                    target.closest('button') ||
                    target.getAttribute('role') === 'button'
                ) {
                    setIsHovering(true);
                } else {
                    setIsHovering(false);
                }
            };

            window.addEventListener('mousemove', updateCursorPosition);
            window.addEventListener('mouseover', handleMouseOver);

            return () => {
                window.removeEventListener('mousemove', updateCursorPosition);
                window.removeEventListener('mouseover', handleMouseOver);
            };
        }
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* The main tiny dot that follows exactly */}
            <div
                className="fixed top-0 left-0 w-3 h-3 bg-champagne-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    transform: `translate(${position.x - 6}px, ${position.y - 6}px)`,
                    transition: 'transform 0.05s linear',
                    willChange: 'transform'
                }}
            />

            {/* The outer ring that expands on hover */}
            <div
                className="fixed top-0 left-0 w-10 h-10 border border-champagne-500 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out"
                style={{
                    transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isHovering ? 1.5 : 1})`,
                    opacity: isHovering ? 0.8 : 0.2,
                    willChange: 'transform, opacity, scale'
                }}
            />
        </>
    );
}
