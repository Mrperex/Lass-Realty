import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Lead from '@/models/Lead'
import { verifyAuth } from '@/lib/auth'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 })
        }

        await connectToDatabase()

        const body = await req.json()
        const { status, note } = body

        const update: any = {}

        if (status) {
            update.status = status
        }

        if (note) {
            update.$push = {
                notes: {
                    text: note,
                    createdAt: new Date(),
                    by: auth.sub || 'admin',
                },
            }
        }

        const lead = await Lead.findByIdAndUpdate(
            params.id,
            update,
            { new: true }
        ).lean()

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            lead,
        })
    } catch (err) {
        console.error('Lead update error:', err)
        return NextResponse.json(
            { error: 'Failed to update lead' },
            { status: 500 }
        )
    }
}
