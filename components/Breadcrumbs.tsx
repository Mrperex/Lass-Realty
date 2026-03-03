'use client';

import { Link } from '@/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from '@/navigation';

interface BreadCrumb {
    name: string;
    url: string;
}

export default function Breadcrumbs({ customCrumbs }: { customCrumbs?: BreadCrumb[] }) {
    const pathname = usePathname();

    // Auto-generate crumbs if none provided
    const generateCrumbs = (): BreadCrumb[] => {
        if (customCrumbs) return customCrumbs;

        const pathSegments = pathname.split('/').filter(p => p);
        let url = '';

        return pathSegments.map(segment => {
            url += `/${segment}`;
            // Format segment string (e.g. 'punta-cana' -> 'Punta Cana')
            const formattedName = segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            return {
                name: formattedName,
                url
            };
        });
    };

    const crumbs = generateCrumbs();

    if (crumbs.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm font-outfit text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-champagne-600 transition-colors flex items-center">
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
            </Link>

            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                    <div key={crumb.url} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-2 text-slate-300 flex-shrink-0" />
                        {isLast ? (
                            <span className="font-semibold text-slate-900 truncate max-w-[200px] md:max-w-[400px]">
                                {crumb.name}
                            </span>
                        ) : (
                            <Link href={crumb.url} className="hover:text-champagne-600 transition-colors">
                                {crumb.name}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
