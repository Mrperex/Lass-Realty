'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { PropertyBrochure } from './PropertyBrochure';
import { useTranslations } from 'next-intl';

interface DownloadBrochureButtonProps {
    property: any;
    label?: string;
}

export default function DownloadBrochureButton({ property, label }: DownloadBrochureButtonProps) {
    const [isClient, setIsClient] = useState(false);
    const t = useTranslations('PropertyDetail');

    const buttonLabel = label || t('downloadBrochure', { defaultValue: 'Brochure' });

    // Only render the PDFDownloadLink on the client side to avoid hydration errors
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <button disabled className="flex items-center gap-2 justify-center py-3 px-6 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm opacity-50">
                <Download className="w-5 h-5" />
                {buttonLabel}
            </button>
        );
    }

    const docToRender: any = <PropertyBrochure property={property} />;

    return (
        <PDFDownloadLink
            document={docToRender}
            fileName={"Brochure_" + (property?.title || "Property").split(' ').join('_') + ".pdf"}
            className="flex items-center gap-2 justify-center py-3 px-6 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50"
        >
            {({ blob, url, loading, error }) =>
                loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5" />
                        {buttonLabel}
                    </>
                )
            }
        </PDFDownloadLink>
    );
}

