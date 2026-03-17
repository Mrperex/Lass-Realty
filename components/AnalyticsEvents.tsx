'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { useRecentStore } from '@/store/recentStore';
import { IProperty } from '@/types/property';
import { trackEvent } from '@/lib/analytics';

export function TrackPropertyView({ property }: { property: IProperty }) {
    const addRecent = useRecentStore((state) => state.addRecent);

    useEffect(() => {
        sendGAEvent({ event: 'property_view', property_slug: property.slug });
        
        trackEvent('property_view', {
            property_name: property.title,
            price: property.price,
            location: property.city,
            property_type: property.type || 'Unknown',
            bedrooms: property.bedrooms
        });

        addRecent(property);
    }, [property, addRecent]);

    return null;
}
