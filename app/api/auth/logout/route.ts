import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = cookies();
    cookieStore.delete('lass_admin_auth');

    return NextResponse.json({ success: true });
}
