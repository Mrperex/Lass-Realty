import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(req: Request) {
    try {
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
        console.error('Properties fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
