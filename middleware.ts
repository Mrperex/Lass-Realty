import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if trying to access admin routes (except login)
    if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
        const authCookie = request.cookies.get('lass_admin_auth');

        // If no cookie or invalid value, redirect to login
        if (!authCookie || authCookie.value !== 'true') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // If trying to access login page while already authenticated, redirect to admin dashboard
    if (request.nextUrl.pathname === '/admin/login') {
        const authCookie = request.cookies.get('lass_admin_auth');
        if (authCookie && authCookie.value === 'true') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
