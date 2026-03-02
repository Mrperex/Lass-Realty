import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'lass_admin_auth'

/**
 * Lightweight JWT verification for Edge Runtime (middleware).
 * We parse the JWT payload without full crypto verification here,
 * then rely on the full jsonwebtoken verify in the actual API routes.
 * 
 * This is safe because:
 * 1. Middleware is a gateway, not the final authority
 * 2. Actual API routes do full verification via lib/auth.ts
 * 3. We still check token structure and expiry
 */
function isValidJwtStructure(token: string): boolean {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return false

        // Decode the payload (middle part)
        const payload = JSON.parse(atob(parts[1]))

        // Check required fields
        if (!payload.sub || !payload.role || payload.role !== 'admin') return false

        // Check expiry
        if (payload.exp && payload.exp * 1000 < Date.now()) return false

        return true
    } catch {
        return false
    }
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Skip login page (but redirect to dashboard if already authed)
    if (pathname === '/admin/login') {
        const cookieToken = req.cookies.get(COOKIE_NAME)?.value
        if (cookieToken && isValidJwtStructure(cookieToken)) {
            return NextResponse.redirect(new URL('/admin', req.url))
        }
        return NextResponse.next()
    }

    const isAdminRoute = pathname.startsWith('/admin')
    const isApiAdminRoute = pathname.startsWith('/api/admin')

    if (!isAdminRoute && !isApiAdminRoute) {
        return NextResponse.next()
    }

    // ✅ 1. Check Bearer token (mobile first-class)
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        if (isValidJwtStructure(token)) {
            return NextResponse.next()
        }
    }

    // ✅ 2. Check cookie (web dashboard)
    const cookieToken = req.cookies.get(COOKIE_NAME)?.value
    if (cookieToken && isValidJwtStructure(cookieToken)) {
        return NextResponse.next()
    }

    // ⭐ APIs get JSON 401 (mobile-friendly)
    if (isApiAdminRoute) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    // ⭐ Browser pages still redirect
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
}
