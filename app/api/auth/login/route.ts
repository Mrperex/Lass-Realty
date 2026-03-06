import { NextResponse } from 'next/server'
import { signAdminToken } from '@/lib/auth'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'
import bcrypt from 'bcrypt'

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const COOKIE_NAME = 'lass_admin_auth'

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { password, email = 'admin@lassrealty.com' } = await req.json()

        if (!password) {
            return NextResponse.json({ error: 'Password required' }, { status: 400 })
        }

        let admin = await Admin.findOne({ email });

        // Auto-seed admin if none exists across the entire collection
        if (!admin) {
            const adminCount = await Admin.countDocuments();
            if (adminCount === 0) {
                const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
                admin = await Admin.create({
                    email: 'admin@lassrealty.com',
                    passwordHash: hashedPassword
                });
            } else {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
            }
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);

        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        const token = signAdminToken()

        const res = NextResponse.json({
            success: true,
            token, // ⭐ mobile uses this
            admin: { email: admin.email }
        })

        // ⭐ keep cookie for web dashboard
        res.cookies.set({
            name: COOKIE_NAME,
            value: token,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return res
    } catch (err: any) {
        console.error('Login error:', err);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        )
    }
}
