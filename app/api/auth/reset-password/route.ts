import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const { email, token, newPassword } = await req.json();

        if (!email || !token || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();
        const admin = await Admin.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!admin) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.passwordHash = hashedPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save();

        return NextResponse.json({ success: true, message: 'Password has been reset successfully' });
    } catch (err: any) {
        console.error('Reset password error:', err);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
