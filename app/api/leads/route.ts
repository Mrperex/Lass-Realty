import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { checkRateLimit, leadsRatelimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
        const isAllowed = await checkRateLimit(leadsRatelimit, ip);
        if (!isAllowed) {
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }
        const body = await req.json();
        const { name, email, phone, message, propertySlug, bot_field_website } = body;

        // Honeypot spam trap
        if (bot_field_website) {
            // Fake success to fool bots
            return NextResponse.json({ success: true, message: 'Message "sent" successfully.' }, { status: 201 });
        }

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
