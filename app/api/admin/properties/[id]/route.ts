import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { checkAdminRateLimit } from '@/lib/adminRatelimit'
import connectToDatabase from '@/lib/mongodb'
import Property from '@/models/Property'
import cloudinary from '@/lib/cloudinary'

type Params = {
    params: { id: string }
}

/**
 * UPDATE property
 */
export async function PUT(req: Request, { params }: Params) {
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

        const body = await req.json()

        // If city is being updated, regenerate citySlug
        if (body.city) {
            body.citySlug = body.city.toLowerCase().replace(/\s+/g, '-')
        }

        const property = await Property.findByIdAndUpdate(
            params.id,
            { ...body, updatedAt: new Date() },
            { new: true }
        )

        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, property })
    } catch (err: any) {
        console.error('Update property error:', err)
        return NextResponse.json(
            { error: 'Failed to update property', details: err.message },
            { status: 500 }
        )
    }
}

/**
 * DELETE property
 */
export async function DELETE(req: Request, { params }: Params) {
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

        const property = await Property.findById(params.id)

        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            )
        }

        // Cleanup Cloudinary images
        if (property.images && property.images.length > 0) {
            for (const url of property.images) {
                try {
                    if (url.includes('res.cloudinary.com')) {
                        const urlParts = url.split('/')
                        const filename = urlParts[urlParts.length - 1]
                        const publicId = filename.split('.')[0]
                        if (publicId) {
                            await cloudinary.uploader.destroy(publicId)
                        }
                    }
                } catch (imgError) {
                    console.warn('Cloudinary cleanup warning:', imgError)
                }
            }
        }

        await Property.findByIdAndDelete(params.id)

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Delete property error:', err)
        return NextResponse.json(
            { error: 'Failed to delete property', details: err.message },
            { status: 500 }
        )
    }
}
