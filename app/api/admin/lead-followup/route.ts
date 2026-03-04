import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Automated Follow-Up for New Leads
 * 
 * Runs via Vercel Cron every 5 minutes. Checks for leads created
 * in the last 5 minutes and marks them as needing follow-up.
 * 
 * In production, this would integrate with an email service
 * (SendGrid, Resend, etc.) to send the actual follow-up email.
 * For now, it auto-updates lead status and adds a follow-up note.
 */
export async function GET(req: NextRequest) {
    try {
        // Auth: Vercel Cron secret or admin JWT
        const cronSecret = req.headers.get('authorization');
        const isCronJob = cronSecret === `Bearer ${process.env.CRON_SECRET}`;

        if (!isCronJob) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        // Find all new leads that were created in the last 5 minutes
        // and don't yet have a follow-up note
        const newLeads = await Lead.find({
            status: 'new',
            createdAt: { $gte: fiveMinutesAgo },
        }).lean();

        if (newLeads.length === 0) {
            return NextResponse.json({
                message: 'No new leads to follow up',
                checked: true,
                timestamp: new Date().toISOString(),
            });
        }

        // Process each new lead
        const results = [];
        for (const lead of newLeads) {
            const leadData = JSON.parse(JSON.stringify(lead));

            // Check if follow-up already exists
            const hasFollowUp = leadData.notes?.some(
                (n: { text: string }) => n.text.includes('Auto follow-up')
            );
            if (hasFollowUp) continue;

            // Add follow-up note and update status
            await Lead.findByIdAndUpdate(leadData._id, {
                status: 'contacted',
                $push: {
                    notes: {
                        text: `Auto follow-up triggered at ${new Date().toISOString()}. Lead source: ${leadData.message?.includes('report') ? 'Market Report Download' : leadData.propertySlug ? `Property: ${leadData.propertySlug}` : 'Contact Form'}`,
                        createdAt: new Date(),
                    },
                },
            });

            results.push({
                id: leadData._id,
                name: leadData.name,
                email: leadData.email,
                source: leadData.propertySlug || 'general',
            });

            // === EMAIL INTEGRATION POINT ===
            // To send actual follow-up emails, integrate one of:
            //
            // Option A — Resend (recommended):
            //   npm install resend
            //   const resend = new Resend(process.env.RESEND_API_KEY);
            //   await resend.emails.send({
            //     from: 'LASS Realty <no-reply@lasspuntacana.com>',
            //     to: leadData.email,
            //     subject: 'Thank you for your interest — LASS Realty',
            //     html: followUpTemplate(leadData),
            //   });
            //
            // Option B — SendGrid:
            //   npm install @sendgrid/mail
            //   sgMail.send({ to, from, subject, html })
            //
            // Option C — Nodemailer (SMTP):
            //   npm install nodemailer
            //   transporter.sendMail({ to, from, subject, html })
        }

        return NextResponse.json({
            message: `Processed ${results.length} new lead(s)`,
            leads: results,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Lead follow-up error:', err);
        return NextResponse.json(
            { error: 'Failed to process follow-ups' },
            { status: 500 }
        );
    }
}
