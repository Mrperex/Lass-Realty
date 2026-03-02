import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        // Check against environment variable, fallback to 'admin' for local dev if not set
        const correctPassword = process.env.ADMIN_PASSWORD || 'admin';

        if (password === correctPassword) {
            // Set secure HTTP-only cookie
            const cookieStore = cookies();
            cookieStore.set('lass_admin_auth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
