import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { checkAdminRateLimit } from '@/lib/adminRatelimit'
import connectToDatabase from '@/lib/mongodb'
import Property from '@/models/Property'

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

        const body = await req.json()
        const { title, description, price, city, bedrooms, bathrooms, squareMeters, status, featured, images } = body

        if (!title || !description || !price || !city) {
            return NextResponse.json(
                { error: 'Missing required fields: title, description, price, city' },
                { status: 400 }
            )
        }

        // Auto-generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')

        const citySlug = city.toLowerCase().replace(/\s+/g, '-')

        // Ensure unique slug
        const existing = await Property.findOne({ slug })
        if (existing) {
            return NextResponse.json(
                { error: 'A property with a similar title already exists. Please modify the title.' },
                { status: 409 }
            )
        }

        const property = await Property.create({
            title,
            slug,
            description,
            price,
            city,
            citySlug,
            bedrooms: bedrooms || 0,
            bathrooms: bathrooms || 0,
            squareMeters: squareMeters || 0,
            status: status || 'for-sale',
            featured: featured || false,
            images: images || [],
        })

        return NextResponse.json({ success: true, property }, { status: 201 })
    } catch (err: any) {
        console.error('Create property error:', err)
        return NextResponse.json(
            { error: 'Failed to create property', details: err.message },
            { status: 500 }
        )
    }
}
