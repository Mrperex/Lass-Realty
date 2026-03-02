import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { checkRateLimit, cloudinarySignRatelimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
        const isAllowed = await checkRateLimit(cloudinarySignRatelimit, ip);
        if (!isAllowed) {
            return NextResponse.json({ error: 'Upload burst limit reached. Please try again later.' }, { status: 429 });
        }
        const body = await req.json();
        const { paramsToSign } = body;

        if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
            return NextResponse.json({ error: 'Cloudinary environment variables missing.' }, { status: 500 });
        }

        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

        return NextResponse.json({
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME
        });
    } catch (error) {
        console.error("Signing error:", error);
        return NextResponse.json({ error: 'Failed to sign request' }, { status: 500 });
    }
}
