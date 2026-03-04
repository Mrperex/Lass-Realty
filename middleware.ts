import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';

const COOKIE_NAME = 'lass_admin_auth'

// Next-Intl Router Configuration
const handleI18nRouting = createIntlMiddleware({
    locales: ['en', 'es', 'fr', 'it', 'ru', 'de', 'ht'],
    defaultLocale: 'en',
    // We force locale prefixes (e.g. /en) to bypass a Next.js rewrite hydration bug on multiple root layouts.
    localePrefix: 'always'
});

/**
 * Lightweight JWT verification for Edge Runtime (middleware).
 * We parse the JWT payload without full crypto verification here,
 * then rely on the full jsonwebtoken verify in the actual API routes.
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

    const isAdminRoute = pathname.startsWith('/admin')
    const isApiAdminRoute = pathname.startsWith('/api/admin')
    const isApiRoute = pathname.startsWith('/api')

    // 🌐 1. Public App Routes -> Route through Next-Intl
    if (!isAdminRoute && !isApiRoute) {
        return handleI18nRouting(req)
    }

    // ⚙️ 2. Public API Routes -> Pass through
    if (isApiRoute && !isApiAdminRoute) {
        return NextResponse.next()
    }

    // 🛡️ 3. Admin Authentication Flow below...

    // Skip login page (but redirect to dashboard if already authed)
    if (pathname === '/admin/login') {
        const cookieToken = req.cookies.get(COOKIE_NAME)?.value
        if (cookieToken && isValidJwtStructure(cookieToken)) {
            return NextResponse.redirect(new URL('/admin', req.url))
        }
        return NextResponse.next()
    }

    // ✅ Check Bearer token (mobile first-class)
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        if (isValidJwtStructure(token)) {
            return NextResponse.next()
        }
    }

    // ✅ Check cookie (web dashboard)
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
    // Match all pathnames except for
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - extensions (.xml, .txt, .js, .json)
    matcher: ['/((?!api|_vercel|_next/static|_next/image|favicon.ico|.*\\.(?:xml|txt|js|json|png|jpg|jpeg|gif|webp)$).*)'],
}
