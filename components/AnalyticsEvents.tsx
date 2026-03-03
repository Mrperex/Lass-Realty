'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { useRecentStore } from '@/store/recentStore';
import { IProperty } from '@/types/property';

export function TrackPropertyView({ property }: { property: IProperty }) {
    const addRecent = useRecentStore((state) => state.addRecent);

    useEffect(() => {
        sendGAEvent({ event: 'property_view', property_slug: property.slug });
        addRecent(property);
    }, [property, addRecent]);

    return null;
}
