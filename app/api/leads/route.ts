import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { checkRateLimit, leadsRatelimit } from '@/lib/ratelimit';
import { Resend } from 'resend';
import { LeadAutoReply } from '@/components/emails/LeadAutoReply';
import { AdminNotification } from '@/components/emails/AdminNotification';

const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Fire instantaneous transactional emails (fire-and-forget for speed)
        if (process.env.RESEND_API_KEY) {
            const safePropertyTitle = propertySlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

            // Await the emails so Vercel Serverless doesn't kill the thread prematurely
            try {
                await Promise.all([
                    resend.emails.send({
                        from: 'LASS Realty <info@lasspuntacana.com>',
                        to: email,
                        subject: `We received your inquiry regarding ${safePropertyTitle}`,
                        react: LeadAutoReply({ name, propertyTitle: safePropertyTitle }),
                    }),
                    resend.emails.send({
                        from: 'LASS Realty Leads <info@lasspuntacana.com>',
                        to: 'pablopok08@gmail.com',
                        subject: `🚨 New Lead: ${name} for ${safePropertyTitle}`,
                        react: AdminNotification({ name, email, phone, message, propertyTitle: safePropertyTitle }),
                    })
                ]);
            } catch (err) {
                console.error('Resend Delivery Error:', err);
            }
        }

        return NextResponse.json({ success: true, lead }, { status: 201 });
    } catch (error: any) {
        console.error('Lead creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
