export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET() {
    try {
        await connectToDatabase();
        if (!mongoose.connection.db) {
            return NextResponse.json({ status: 'Connected, but connection.db is missing' });
        }

        const host = mongoose.connection.host;
        const dbName = mongoose.connection.db.databaseName;
        const count = await mongoose.connection.db.collection('properties').countDocuments();
        const propertyCount = await Property.countDocuments();
        const featuredCount = await Property.countDocuments({ featured: true });

        return NextResponse.json({
            status: 'ok',
            host,
            dbName,
            rawCollectionCount: count,
            mongooseModelCount: propertyCount,
            featuredCount,
            envUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) : 'missing'
        });
    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message, stack: error.stack });
    }
}
