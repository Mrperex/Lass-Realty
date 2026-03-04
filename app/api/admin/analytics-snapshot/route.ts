import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import connectToDatabase from '@/lib/mongodb'
import Property from '@/models/Property'
import Lead from '@/models/Lead'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const auth = verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectToDatabase()

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        const [propertyStats, leadStats, topCityAgg] = await Promise.all([
            // Property stats
            Property.aggregate([
                {
                    $group: {
                        _id: null,
                        totalProperties: { $sum: 1 },
                        activeListings: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'for-sale'] }, 1, 0],
                            },
                        },
                    },
                },
            ]),

            // Lead stats
            Lead.aggregate([
                {
                    $facet: {
                        total: [{ $count: 'count' }],

                        new7d: [
                            { $match: { createdAt: { $gte: sevenDaysAgo } } },
                            { $count: 'count' },
                        ],

                        byStatus: [
                            {
                                $group: {
                                    _id: '$status',
                                    count: { $sum: 1 },
                                },
                            },
                        ],
                    },
                },
            ]),

            // Top city
            Property.aggregate([
                {
                    $group: {
                        _id: '$city',
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 1 },
            ]),
        ])

        // ---------- safe extraction ----------

        const prop = propertyStats[0] || {
            totalProperties: 0,
            activeListings: 0,
        }

        const leadFacet = leadStats[0] || {}

        const totalLeads = leadFacet.total?.[0]?.count || 0
        const newLeads7d = leadFacet.new7d?.[0]?.count || 0

        const leadsByStatusArray = leadFacet.byStatus || []
        const leadsByStatus: Record<string, number> = {}

        for (const row of leadsByStatusArray) {
            leadsByStatus[row._id] = row.count
        }

        const contacted =
            (leadsByStatus['contacted'] || 0) +
            (leadsByStatus['qualified'] || 0)

        const contactedRate =
            totalLeads > 0 ? Number((contacted / totalLeads).toFixed(2)) : 0

        const topCity = topCityAgg[0]?._id || null

        return NextResponse.json({
            totalProperties: prop.totalProperties,
            activeListings: prop.activeListings,
            totalLeads,
            newLeads7d,
            contactedRate,
            topCity,
            leadsByStatus,
            generatedAt: new Date().toISOString(),
        })
    } catch (err) {
        console.error('Analytics snapshot error:', err)
        return NextResponse.json(
            { error: 'Failed to generate analytics snapshot' },
            { status: 500 }
        )
    }
}
