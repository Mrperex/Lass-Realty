import { LOCATIONS } from '@/lib/locations';
import Property from '@/models/Property';
import connectToDatabase from '@/lib/mongodb';
import { MetadataRoute } from 'next';
import mongoose from 'mongoose';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lasspuntacana.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/properties`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    try {
        await connectToDatabase();

        // Priority Locations
        LOCATIONS.forEach(loc => {
            if (loc.priority) {
                sitemapEntries.push({
                    url: `${baseUrl}/locations/${loc.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.9,
                });
            }
        });

        // Property Detail Pages
        if (mongoose.connection.readyState) {
            const properties = await Property.find({}).select('slug updatedAt').lean();
            properties.forEach((p: any) => {
                sitemapEntries.push({
                    url: `${baseUrl}/properties/${p.slug}`,
                    lastModified: p.updatedAt || new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            });
        }
    } catch (e) {
        console.warn('Sitemap generation constraint:', e);
    }

    return sitemapEntries;
}
