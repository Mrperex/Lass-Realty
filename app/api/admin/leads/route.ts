import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const auth = verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectToDatabase()

        const { searchParams } = new URL(req.url)

        const page = Number(searchParams.get('page') || 1)
        const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
        const status = searchParams.get('status')

        const query: any = {}

        if (status && status !== 'all') {
            query.status = status
        }

        const [leads, total] = await Promise.all([
            Lead.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

            Lead.countDocuments(query),
        ])

        return NextResponse.json({
            leads,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (err) {
        console.error('Admin leads fetch error:', err)
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        )
    }
}
