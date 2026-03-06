'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { PropertyBrochure } from './PropertyBrochure';
import { useTranslations } from 'next-intl';

interface DownloadBrochureButtonProps {
    property: any;
    t: any; // Next Intl T function
    label?: string;
}

export default function DownloadBrochureButton({ property, t, label = "Download Brochure" }: DownloadBrochureButtonProps) {
    const [isClient, setIsClient] = useState(false);

    // Only render the PDFDownloadLink on the client side to avoid hydration errors
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <button disabled className="flex items-center gap-2 justify-center py-3 px-6 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm opacity-50">
                <Download className="w-5 h-5" />
                {label}
            </button>
        );
    }

    const docToRender: any = <PropertyBrochure property={property} t={t} />;

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
                        {label}
                    </>
                )
            }
        </PDFDownloadLink>
    );
}
