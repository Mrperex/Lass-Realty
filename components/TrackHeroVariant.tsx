'use client';

import { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export default function TrackHeroVariant({ variant }: { variant: 'A' | 'B' }) {
    useEffect(() => {
        sendGAEvent({ event: 'experiment_viewed', experiment_name: 'hero_headline_split', variant });
    }, [variant]);

    return null; // Invisible analytics component
}
