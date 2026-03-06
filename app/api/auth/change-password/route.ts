import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcrypt';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const authPayload = verifyAuth(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await connectToDatabase();
        // Assume single admin for now, or match by email if authPayload had email
        const admin = await Admin.findOne();

        if (!admin) {
            return NextResponse.json({ error: 'No admin found' }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.passwordHash = hashedPassword;
        await admin.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (err: any) {
        console.error('Change password error:', err);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}
