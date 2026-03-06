import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
const APP_URL = process.env.SITE_URL || 'http://localhost:3000';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await connectToDatabase();
        const admin = await Admin.findOne({ email });

        // Always return success to prevent email enumeration attacks
        if (!admin) {
            return NextResponse.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        admin.resetPasswordToken = resetToken;
        admin.resetPasswordExpires = resetTokenExpiry;
        await admin.save();

        const resetUrl = `${APP_URL}/admin/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'LASS Realty <admin@lasspuntacana.com>',
                to: email,
                subject: 'Password Reset Request',
                html: `
                    <h1>Password Reset</h1>
                    <p>You requested a password reset for your LASS Realty Admin account.</p>
                    <p>Please click the link below to set a new password. This link expires in 1 hour.</p>
                    <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#0f172a;color:white;text-decoration:none;border-radius:8px;">Reset Password</a>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                `
            });
        } else {
            console.log('No Resend API Key found. Reset URL (mock):', resetUrl);
        }

        return NextResponse.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
    } catch (err: any) {
        console.error('Request reset error:', err);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
