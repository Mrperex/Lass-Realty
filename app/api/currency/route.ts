import { NextResponse } from 'next/server';

// Revalidate this endpoint every 12 hours (43200 seconds) 
// to keep Next.js caching extremely aggressive and avoid hammering the free API
export const revalidate = 43200;

export async function GET() {
    try {
        // We use a free, public endpoint that returns accurate daily Forex data relative to USD.
        // It's highly cached on the Edge so we won't get rate limited.
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');

        if (!response.ok) {
            throw new Error(`External API responded with status: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            rates: {
                EUR: data.rates.EUR,
                CAD: data.rates.CAD,
                GBP: data.rates.GBP,
                DOP: data.rates.DOP,
            },
            timestamp: data.time_last_updated_unix
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
            }
        });

    } catch (error: any) {
        console.error('Failed to fetch live currency rates:', error.message);

        // Return 500 status. The frontend Zustand store will intercept this 
        // and gracefully drop down to its hardcoded Fallback Rates so the user never sees an error.
        return NextResponse.json(
            { error: 'Failed to synchronize live forex rates.' },
            { status: 500 }
        );
    }
}
