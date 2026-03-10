import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { checkAdminRateLimit } from '@/lib/adminRatelimit';

// chunk text to avoid URI length limits. Google Translate free tier has a limit per request.
function chunkText(text: string, maxLength: number = 4000): string[] {
    if (!text) return [];

    // Simple punctuation-based splitting to avoid breaking words/sentences
    const chunks: string[] = [];
    let currentChunk = '';

    const sentences = text.split(/(?<=[.?!])\s+/);

    for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > maxLength) {
            chunks.push(currentChunk);
            currentChunk = sentence;
        } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
    }
    if (currentChunk) chunks.push(currentChunk);

    return chunks;
}

export async function POST(req: Request) {
    try {
        const auth = verifyAuth(req);
        if (!auth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const rl = await checkAdminRateLimit(auth.sub);
        if (!rl.success) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const { text, targetLang, sourceLang = 'en' } = await req.json();

        if (!text || !targetLang) {
            return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
        }

        const chunks = chunkText(text);
        let translatedText = '';

        for (const chunk of chunks) {
            // Using Google Translate free API
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Translation API failed');
            }

            const data = await response.json();
            // Google Translate returns an array of arrays where the first element is the translated chunk
            if (data && data[0]) {
                const chunkTranslation = data[0].map((item: any) => item[0]).join('');
                translatedText += chunkTranslation + ' ';
            }
        }

        return NextResponse.json({ success: true, translatedText: translatedText.trim() });
    } catch (err: any) {
        console.error('Translation error:', err);
        return NextResponse.json(
            { error: 'Failed to translate', details: err.message },
            { status: 500 }
        );
    }
}
