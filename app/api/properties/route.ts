import { NextResponse } from 'next/server';
import Property from '@/models/Property';
import { checkRateLimit, publicApiRatelimit } from '@/lib/ratelimit';
import redis from '@/lib/redis';
import { withDatabase } from '@/lib/dbUtils';

const CACHE_TTL = 60; // seconds

export async function GET(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
        const isAllowed = await checkRateLimit(publicApiRatelimit, ip);
        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const featured = searchParams.get('featured') === 'true';

        // Build a deterministic cache key from query params
        const cacheKey = `properties:${featured ? 'featured' : 'all'}:${limit}`;

        // Try Redis cache first
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                const data = typeof cached === 'string' ? JSON.parse(cached) : cached;
                return NextResponse.json({ success: true, properties: data, cached: true }, { status: 200 });
            }
        } catch (cacheError) {
            // Redis failure is non-fatal — fall through to MongoDB
            console.warn('Redis cache read failed, falling back to MongoDB:', cacheError);
        }

        const properties = await withDatabase(async () => {
            const query: any = {};
            
            // Support all search parameters from the page
            if (searchParams.has('featured')) {
                query.featured = featured;
            }
            
            if (searchParams.get('city')) {
                query.citySlug = searchParams.get('city');
            }

            if (searchParams.get('beds')) {
                const bedCount = Number(searchParams.get('beds'));
                if (!isNaN(bedCount)) {
                    if (bedCount >= 4) {
                        query.bedrooms = { $gte: 4 };
                    } else {
                        query.bedrooms = bedCount;
                    }
                }
            }

            if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
                query.price = {};
                if (searchParams.get('minPrice') && !isNaN(Number(searchParams.get('minPrice')))) {
                    query.price.$gte = Number(searchParams.get('minPrice'));
                }
                if (searchParams.get('maxPrice') && !isNaN(Number(searchParams.get('maxPrice')))) {
                    query.price.$lte = Number(searchParams.get('maxPrice'));
                }
            }

            if (searchParams.get('amenities')) {
                const amenitiesList = searchParams.get('amenities')!.split(',').filter(Boolean);
                if (amenitiesList.length > 0) {
                    query.amenities = { $all: amenitiesList };
                }
            }

            // Default status to for-sale if not specified
            if (!searchParams.get('status')) {
                query.status = 'for-sale';
            } else {
                query.status = searchParams.get('status');
            }

            let sortQuery: any = { createdAt: -1 };

            switch (searchParams.get('sort')) {
                case 'price-asc':
                    sortQuery = { price: 1, createdAt: -1 };
                    break;
                case 'price-desc':
                    sortQuery = { price: -1, createdAt: -1 };
                    break;
                case 'popular':
                    sortQuery = { featured: -1, createdAt: -1 };
                    break;
                case 'newest':
                default:
                    sortQuery = { createdAt: -1 };
                    break;
            }

            const results = await Property.find(query)
                .limit(limit)
                .sort(sortQuery)
                .lean()
                .exec();

            return results;
        }, []);

        // Write to Redis cache (fire-and-forget, non-blocking)
        try {
            await redis.set(cacheKey, JSON.stringify(properties), { ex: CACHE_TTL });
        } catch (cacheError) {
            console.warn('Redis cache write failed:', cacheError);
        }

        return NextResponse.json({ 
            success: true, 
            properties,
            count: properties.length 
        }, { status: 200 });
    } catch (error: any) {
        console.error('Properties fetch error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Internal server error', 
                details: error.message 
            },
            { status: 500 }
        );
    }
}
