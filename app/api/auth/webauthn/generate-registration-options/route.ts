import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyAuth } from '@/lib/auth';

const rpName = 'LASS Realty Admin';
const rpID = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'localhost';
const origin = process.env.SITE_URL || `http://${rpID}:3000`;

export async function GET(req: Request) {
    try {
        const authPayload = verifyAuth(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const admin = await Admin.findOne();

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new Uint8Array(Buffer.from("admin-user-id-fixed")),
            userName: admin.email,
            attestationType: 'none',
            excludeCredentials: admin.credentials.map((cred: any) => ({
                id: new Uint8Array(Buffer.from(cred.credentialID, 'base64url')),
                type: 'public-key',
                transports: cred.transports,
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform',
            },
        });

        // Save challenge to admin
        admin.currentChallenge = options.challenge;
        await admin.save();

        return NextResponse.json(options);
    } catch (err: any) {
        console.error('Generate Registration Options error:', err);
        return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 });
    }
}
