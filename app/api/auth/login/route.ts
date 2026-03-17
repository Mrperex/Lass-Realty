import { NextResponse } from 'next/server'
import { signAdminToken } from '@/lib/auth'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'
import bcrypt from 'bcrypt'

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Laasrealty2026'
const COOKIE_NAME = 'lass_admin_auth'

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { password, email = 'info@lasspuntacana.com' } = await req.json()

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
                    email: 'info@lasspuntacana.com',
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

        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is missing from environment');
            throw new Error('Server configuration error: JWT_SECRET missing');
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
        console.error('CRITICAL: Login route failure:', {
            message: err.message,
            stack: err.stack,
            error: err
        });
        return NextResponse.json(
            { 
                error: 'Login failed', 
                details: process.env.NODE_ENV === 'development' ? err.message : 'Check server logs' 
            },
            { status: 500 }
        )
    }
}
