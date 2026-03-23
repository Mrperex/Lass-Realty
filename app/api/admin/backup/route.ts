import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';
import Lead from '@/models/Lead';
import Post from '@/models/Post';
import Neighborhood from '@/models/Neighborhood';
import DocumentModel from '@/models/Document';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60s for large data exports

/**
 * Automated Database Backup Endpoint
 * 
 * Usage:
 *   - Vercel Cron: runs daily at 03:00 UTC (configured in vercel.json)
 *   - Manual: GET /api/admin/backup with auth header
 * 
 * Returns a JSON snapshot of all MongoDB collections.
 * The data can be saved as a .json file for disaster recovery.
 */
export async function GET(req: NextRequest) {
    try {
        // Verify auth — cron jobs from Vercel include CRON_SECRET
        const cronSecret = req.headers.get('authorization');
        const isCronJob = cronSecret === `Bearer ${process.env.CRON_SECRET}`;
        const isAdmin = verifyAuth(req);

        if (!isCronJob && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const timestamp = new Date().toISOString();

        // Export all collections in parallel
        const [properties, leads, posts, neighborhoods, documents] = await Promise.all([
            Property.find({}).lean(),
            Lead.find({}).lean(),
            Post.find({}).lean(),
            Neighborhood.find({}).lean(),
            DocumentModel.find({}).lean(),
        ]);

        const backup = {
            metadata: {
                generatedAt: timestamp,
                version: '1.0',
                environment: process.env.NODE_ENV,
                collections: {
                    properties: properties.length,
                    leads: leads.length,
                    posts: posts.length,
                    neighborhoods: neighborhoods.length,
                    documents: documents.length,
                },
                totalRecords: properties.length + leads.length + posts.length + neighborhoods.length + documents.length,
            },
            data: {
                properties: JSON.parse(JSON.stringify(properties)),
                leads: JSON.parse(JSON.stringify(leads)),
                posts: JSON.parse(JSON.stringify(posts)),
                neighborhoods: JSON.parse(JSON.stringify(neighborhoods)),
                documents: JSON.parse(JSON.stringify(documents)),
            },
        };

        // Return as downloadable JSON
        return new NextResponse(JSON.stringify(backup, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="lass-realty-backup-${timestamp.split('T')[0]}.json"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (err) {
        console.error('Backup error:', err);
        return NextResponse.json(
            { error: 'Failed to generate backup' },
            { status: 500 }
        );
    }
}
