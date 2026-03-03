import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import { checkRateLimit, publicApiRatelimit } from '@/lib/ratelimit';

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

        await connectToDatabase();

        const query: any = {};
        if (searchParams.has('featured')) {
            query.featured = featured;
        }

        const properties = await Property.find(query).limit(limit).sort({ createdAt: -1 });

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
