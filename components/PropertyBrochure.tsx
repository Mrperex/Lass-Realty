import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf', fontWeight: 700 }
    ]
});

const styles = StyleSheet.create({
    page: { backgroundColor: '#ffffff', padding: 40, fontFamily: 'Inter' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1 solid #f1f5f9', paddingBottom: 20 },
    logo: { fontSize: 24, fontWeight: 700, color: '#0f172a' },
    website: { fontSize: 10, color: '#64748b' },
    heroImage: { width: '100%', height: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 20 },
    titleBlock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    title: { fontSize: 22, fontWeight: 700, color: '#0f172a', width: '70%', lineHeight: 1.2 },
    price: { fontSize: 20, fontWeight: 700, color: '#d97706', width: '30%', textAlign: 'right' },
    location: { fontSize: 12, color: '#64748b', marginBottom: 16 },
    specs: { flexDirection: 'row', gap: 20, marginBottom: 24, backgroundColor: '#f8fafc', padding: 12, borderRadius: 6 },
    specItem: { flexDirection: 'column' },
    specValue: { fontSize: 14, fontWeight: 600, color: '#0f172a' },
    specLabel: { fontSize: 10, color: '#64748b' },
    descriptionTitle: { fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 },
    description: { fontSize: 10, lineHeight: 1.6, color: '#475569', marginBottom: 20 },
    featuresBlock: { flexWrap: 'wrap', flexDirection: 'row', gap: 10, marginBottom: 30 },
    featureItem: { backgroundColor: '#f1f5f9', padding: '6 10', borderRadius: 4, fontSize: 10, color: '#334155' },
    footer: { position: 'absolute', bottom: 40, left: 40, right: 40, borderTop: '1 solid #f1f5f9', paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
    footerColumn: { flexDirection: 'column', gap: 4 },
    footerTitle: { fontSize: 10, fontWeight: 600, color: '#0f172a' },
    footerText: { fontSize: 9, color: '#64748b' },
});

export const PropertyBrochure = ({ property }: { property: any }) => {
    // Determine the price display
    let priceDisplay = '';
    if (property.status === 'for-sale') {
        priceDisplay = "$" + property.price.toLocaleString();
    } else {
        priceDisplay = "$" + property.price.toLocaleString() + " / " + (property.rentPeriod || 'month');
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.logo}>LASS REALTY</Text>
                    <Text style={styles.website}>www.lasspuntacana.com</Text>
                </View>

                {property.images && property.images.length > 0 && (() => {
                    let imgSrc = property.images[0];
                    // @react-pdf/renderer needs absolute URLs — local paths like /images/... won't work
                    if (imgSrc.startsWith('/')) {
                        imgSrc = 'https://lasspuntacana.com' + imgSrc;
                    }
                    try {
                        return <Image style={styles.heroImage} src={imgSrc} />;
                    } catch {
                        return null;
                    }
                })()}

                <View style={styles.titleBlock}>
                    <Text style={styles.title}>{property.title}</Text>
                    <Text style={styles.price}>{priceDisplay}</Text>
                </View>

                <Text style={styles.location}>{property.city || ''}, Dominican Republic</Text>

                <View style={styles.specs}>
                    <View style={styles.specItem}>
                        <Text style={styles.specValue}>{property.type.toUpperCase()}</Text>
                        <Text style={styles.specLabel}>Property Type</Text>
                    </View>
                    {(property.bedrooms > 0) && (
                        <View style={styles.specItem}>
                            <Text style={styles.specValue}>{property.bedrooms}</Text>
                            <Text style={styles.specLabel}>Bedrooms</Text>
                        </View>
                    )}
                    {(property.bathrooms > 0) && (
                        <View style={styles.specItem}>
                            <Text style={styles.specValue}>{property.bathrooms}</Text>
                            <Text style={styles.specLabel}>Bathrooms</Text>
                        </View>
                    )}
                    {(property.squareMeters > 0) && (
                        <View style={styles.specItem}>
                            <Text style={styles.specValue}>{property.squareMeters}</Text>
                            <Text style={styles.specLabel}>Sq. Meters</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.descriptionTitle}>Overview</Text>
                <Text style={styles.description}>{property.description}</Text>

                {property.amenities && property.amenities.length > 0 && (
                    <View>
                        <Text style={styles.descriptionTitle}>Amenities & Features</Text>
                        <View style={styles.featuresBlock}>
                            {property.amenities.map((amenity: string, idx: number) => {
                                return (
                                    <Text key={idx} style={styles.featureItem}>
                                        {amenity.replace(/([A-Z])/g, ' $1').trim()}
                                    </Text>
                                );
                            })}
                        </View>
                    </View>
                )}

                <View style={styles.footer}>
                    <View style={styles.footerColumn}>
                        <Text style={styles.footerTitle}>Contact LASS Realty</Text>
                        <Text style={styles.footerText}>Phone: +1 (809) 555-0100</Text>
                        <Text style={styles.footerText}>Email: info@lasspuntacana.com</Text>
                    </View>
                    <View style={styles.footerColumn}>
                        <Text style={styles.footerTitle}>Reference ID</Text>
                        <Text style={styles.footerText}>{property._id.toString().substring(0, 8)}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
