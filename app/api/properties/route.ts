import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { checkRateLimit, publicApiRatelimit } from '@/lib/ratelimit';
import redis from '@/lib/redis';

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
                return NextResponse.json({ properties: data, cached: true }, { status: 200 });
            }
        } catch (cacheError) {
            // Redis failure is non-fatal — fall through to MongoDB
            console.warn('Redis cache read failed, falling back to MongoDB:', cacheError);
        }

        await connectToDatabase();

        const query: any = {};
        if (searchParams.has('featured')) {
            query.featured = featured;
        }

        const properties = await Property.find(query).limit(limit).sort({ createdAt: -1 });

        // Write to Redis cache (fire-and-forget, non-blocking)
        try {
            await redis.set(cacheKey, JSON.stringify(properties), { ex: CACHE_TTL });
        } catch (cacheError) {
            console.warn('Redis cache write failed:', cacheError);
        }

        return NextResponse.json({ properties }, { status: 200 });
    } catch (error: any) {
        if (error && error.digest === 'DYNAMIC_SERVER_USAGE') throw error;
        console.error('Properties fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
