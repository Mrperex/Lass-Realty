import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyAuth } from '@/lib/auth';

const rpID = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'localhost';
const origin = process.env.SITE_URL || `http://${rpID}:3000`;

export async function POST(req: Request) {
    try {
        const authPayload = verifyAuth(req);
        if (!authPayload || authPayload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        await connectToDatabase();
        const admin = await Admin.findOne();

        if (!admin || !admin.currentChallenge) {
            return NextResponse.json({ error: 'No active challenge found' }, { status: 400 });
        }

        const expectedChallenge = admin.currentChallenge;

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: body,
                expectedChallenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
            });
        } catch (error: any) {
            console.error('Registration verification failed:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const { verified, registrationInfo } = verification;

        if (verified && registrationInfo) {
            const credentialID = registrationInfo.credential.id;
            const credentialPublicKey = registrationInfo.credential.publicKey;
            const counter = registrationInfo.credential.counter;

            const newCredential = {
                credentialID: credentialID,
                credentialPublicKey: Buffer.from(credentialPublicKey),
                counter,
                credentialDeviceType: registrationInfo.credentialDeviceType || 'singleDevice',
                credentialBackedUp: registrationInfo.credentialBackedUp || false,
                transports: body.response.transports || [],
            };

            admin.credentials.push(newCredential);
            admin.currentChallenge = undefined; // Clear the challenge
            await admin.save();

            return NextResponse.json({ success: true, message: 'Face ID / Touch ID registered successfully' });
        } else {
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }

    } catch (err: any) {
        console.error('Verify Registration error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
