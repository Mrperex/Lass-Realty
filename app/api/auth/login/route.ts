import { NextResponse } from 'next/server'
import { signAdminToken } from '@/lib/auth'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const COOKIE_NAME = 'lass_admin_auth'

export async function POST(req: Request) {
    try {
        const { password } = await req.json()

        if (!password || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        const token = signAdminToken()

        const res = NextResponse.json({
            success: true,
            token, // ⭐ mobile uses this
        })

        // ⭐ keep cookie for web dashboard
        res.cookies.set({
            name: COOKIE_NAME,
            value: token,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return res
    } catch (err) {
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        )
    }
}
