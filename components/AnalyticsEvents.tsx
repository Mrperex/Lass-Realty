'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export function TrackPropertyView({ slug }: { slug: string }) {
    useEffect(() => {
        sendGAEvent({ event: 'property_view', property_slug: slug });
    }, [slug]);

    return null;
}
