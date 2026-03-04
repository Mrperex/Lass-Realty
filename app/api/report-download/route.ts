import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { syncLeadToHubspot } from '@/lib/hubspot';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, reportId } = body;

        if (!name || !email || !reportId) {
            return NextResponse.json(
                { error: 'Name, email, and reportId are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Save as a lead with report context
        await Lead.create({
            name,
            email,
            phone: 'N/A (report download)',
            message: `Downloaded market report: ${reportId}`,
            status: 'new',
            notes: [{
                text: `Lead captured via Market Reports page — report: ${reportId}`,
                createdAt: new Date(),
            }],
        });

        // Sync to HubSpot
        await syncLeadToHubspot({
            name,
            email,
            message: `Requested Market Report: ${reportId}`,
            source: 'Market Report Download'
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Report download error:', err);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
