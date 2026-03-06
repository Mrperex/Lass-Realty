import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { signAdminToken } from '@/lib/auth';

const rpID = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'localhost';
const origin = process.env.SITE_URL || `http://${rpID}:3000`;
const COOKIE_NAME = 'lass_admin_auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        await connectToDatabase();
        const admin = await Admin.findOne();

        if (!admin || !admin.currentChallenge) {
            return NextResponse.json({ error: 'No active challenge found' }, { status: 400 });
        }

        const expectedChallenge = admin.currentChallenge;
        const credential = admin.credentials.find(
            (c: any) => c.credentialID === body.id
        );

        if (!credential) {
            return NextResponse.json({ error: 'Authenticator is not registered with this site' }, { status: 400 });
        }

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: body,
                expectedChallenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
                credential: {
                    id: credential.credentialID,
                    publicKey: credential.credentialPublicKey,
                    counter: credential.counter,
                    transports: credential.transports,
                },
            });
        } catch (error: any) {
            console.error('Authentication verification failed:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const { verified, authenticationInfo } = verification;

        if (verified) {
            // Update the counter
            credential.counter = authenticationInfo.newCounter;
            admin.currentChallenge = undefined; // Clear the challenge
            await admin.save();

            const token = signAdminToken();

            const res = NextResponse.json({
                success: true,
                token,
                admin: { email: admin.email }
            });

            res.cookies.set({
                name: COOKIE_NAME,
                value: token,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            });

            return res;
        } else {
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }

    } catch (err: any) {
        console.error('Verify Authentication error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
