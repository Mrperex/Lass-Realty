import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';

const rpID = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'localhost';

export async function GET() {
    try {
        await connectToDatabase();
        const admin = await Admin.findOne();

        if (!admin || !admin.credentials || admin.credentials.length === 0) {
            return NextResponse.json({ error: 'No Face ID / Touch ID registered' }, { status: 400 });
        }

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials: admin.credentials.map((cred: any) => ({
                id: cred.credentialID,
                type: 'public-key',
                transports: cred.transports,
            })),
            userVerification: 'preferred',
        });

        // Save challenge to admin
        admin.currentChallenge = options.challenge;
        await admin.save();

        return NextResponse.json(options);
    } catch (err: any) {
        console.error('Generate Authentication Options error:', err);
        return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 });
    }
}
