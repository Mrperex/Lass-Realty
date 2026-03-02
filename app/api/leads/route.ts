import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, message, propertySlug } = body;

        if (!name || !email || !phone || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const lead = await Lead.create({
            name,
            email,
            phone,
            message,
            propertySlug,
        });

        return NextResponse.json({ success: true, lead }, { status: 201 });
    } catch (error: any) {
        console.error('Lead creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
