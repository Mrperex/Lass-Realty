import { Suspense } from 'react';
import PropertiesFetcher from '@/components/PropertiesFetcher';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton';

interface PropertiesContentProps {
    searchParams: { [key: string]: string | string[] | undefined };
    locale: string;
}

export default function PropertiesContent({ searchParams, locale }: PropertiesContentProps) {
    return (
        <Suspense 
            fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <PropertyCardSkeleton key={i} />
                    ))}
                </div>
            }
        >
            <PropertiesFetcher 
                initialProperties={[]} 
                locale={locale} 
            />
        </Suspense>
    );
}
