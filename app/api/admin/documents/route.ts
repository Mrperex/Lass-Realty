import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { checkAdminRateLimit } from '@/lib/adminRatelimit'
import connectToDatabase from '@/lib/mongodb'
import Document from '@/models/Document'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const auth = verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const rl = await checkAdminRateLimit(auth.sub)
        if (!rl.success) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
        }

        await connectToDatabase()

        const formData = (await req.formData()) as any

        const file = formData.get('file') as File | null
        const type = (formData.get('type') as string) || 'other'
        const propertyId = formData.get('propertyId') as string | null
        const leadId = formData.get('leadId') as string | null

        if (!file) {
            return NextResponse.json(
                { error: 'File is required' },
                { status: 400 }
            )
        }

        // ---------- convert to buffer ----------
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // ---------- detect resource type ----------
        const isPdf = file.type === 'application/pdf'

        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: isPdf ? 'raw' : 'image',
                        folder: 'lass-realty/documents',
                    },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )
                .end(buffer)
        })

        // ---------- save metadata ----------
        const doc = await Document.create({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            type,
            propertyId: propertyId || null,
            leadId: leadId || null,
            uploadedBy: auth.sub || 'admin',
        })

        return NextResponse.json({
            success: true,
            document: doc,
        })
    } catch (err: any) {
        console.error('Document upload error:', err)
        return NextResponse.json(
            { error: 'Failed to upload document', details: err.message },
            { status: 500 }
        )
    }
}
