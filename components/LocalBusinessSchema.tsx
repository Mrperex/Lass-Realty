export function LocalBusinessSchema() {
    const offices = [
        {
            "@type": "RealEstateAgent",
            name: "LASS Realty - Punta Cana Village",
            description: "Premium real estate agency specializing in luxury properties in Punta Cana",
            url: "https://lasspuntacana.com",
            telephone: "+1-809-686-0484",
            email: "info@lasspuntacana.com",
            address: {
                "@type": "PostalAddress",
                streetAddress: "Punta Cana Village, Suite 23",
                addressLocality: "Punta Cana",
                addressRegion: "La Altagracia",
                postalCode: "23000",
                addressCountry: "DO"
            },
            geo: {
                "@type": "GeoCoordinates",
                latitude: 18.5957,
                longitude: -68.4195
            },
            openingHours: [
                "Mo-Fr 09:00-18:00",
                "Sa 10:00-16:00"
            ],
            languagesSpoken: ["English", "Spanish", "French", "Italian", "German", "Russian", "Haitian Creole"],
            priceRange: "$$$$",
            paymentAccepted: ["Cash", "Credit Card", "Wire Transfer"],
            areaServed: [
                {
                    "@type": "Place",
                    name: "Punta Cana"
                },
                {
                    "@type": "Place",
                    name: "Cap Cana"
                },
                {
                    "@type": "Place",
                    name: "Bavaro"
                }
            ]
        },
        {
            "@type": "RealEstateAgent",
            name: "LASS Realty - Cap Cana Marina",
            description: "Luxury real estate office at Cap Cana Marina specializing in waterfront properties",
            url: "https://lasspuntacana.com",
            telephone: "+1-809-960-4255",
            email: "capcana@lasspuntacana.com",
            address: {
                "@type": "PostalAddress",
                streetAddress: "Marina Cap Cana, Building A",
                addressLocality: "Cap Cana",
                addressRegion: "La Altagracia",
                postalCode: "23000",
                addressCountry: "DO"
            },
            geo: {
                "@type": "GeoCoordinates",
                latitude: 18.5100,
                longitude: -68.3894
            },
            openingHours: [
                "Mo-Fr 10:00-19:00",
                "Sa 10:00-17:00"
            ],
            languagesSpoken: ["English", "Spanish", "Portuguese"],
            priceRange: "$$$$",
            paymentAccepted: ["Cash", "Credit Card", "Wire Transfer"],
            areaServed: [
                {
                    "@type": "Place",
                    name: "Cap Cana"
                },
                {
                    "@type": "Place",
                    name: "Punta Cana"
                }
            ]
        }
    ];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(offices)
            }}
        />
    );
}
