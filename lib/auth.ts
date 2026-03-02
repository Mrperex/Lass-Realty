import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = 'lass_admin_auth'

export type AdminToken = {
    sub: string
    role: 'admin'
}

/**
 * Create JWT
 */
export function signAdminToken(): string {
    const opts: jwt.SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
    }
    return jwt.sign(
        { sub: 'admin', role: 'admin' },
        JWT_SECRET,
        opts
    )
}

/**
 * Verify JWT safely
 */
export function verifyJwt(token: string): AdminToken | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AdminToken
    } catch {
        return null
    }
}

/**
 * Universal auth checker
 * Priority:
 *   1. Authorization Bearer token
 *   2. HTTP-only cookie
 */
export function verifyAuth(req?: NextRequest): AdminToken | null {
    // ✅ 1. Bearer token (mobile first-class)
    const authHeader = req?.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const decoded = verifyJwt(token)
        if (decoded) return decoded
    }

    // ✅ 2. Cookie fallback (web dashboard)
    try {
        const cookieStore = cookies()
        const cookieToken = cookieStore.get(COOKIE_NAME)?.value
        if (cookieToken) {
            const decoded = verifyJwt(cookieToken)
            if (decoded) return decoded
        }
    } catch {
        // ignore in edge contexts
    }

    return null
}
