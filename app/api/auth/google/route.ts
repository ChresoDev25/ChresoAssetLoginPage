import { NextRequest, NextResponse } from 'next/server';
import { verifyGoogleToken, createSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        // CSRF Check: Validate Origin
        const origin = req.headers.get('origin');
        const host = req.headers.get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const expectedOrigin = `${protocol}://${host}`;

        if (origin && origin !== expectedOrigin) {
            return NextResponse.json({ error: 'CSRF Forbidden' }, { status: 403 });
        }

        const { credential } = await req.json();

        if (!credential) {
            return NextResponse.json({ error: 'Missing credential' }, { status: 400 });
        }

        const payload = await verifyGoogleToken(credential);

        if (!payload || !payload.email || !payload.sub) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Upsert user
        const user = await prisma.user.upsert({
            where: { googleId: payload.sub },
            update: {
                name: payload.name,
                image: payload.picture,
            },
            create: {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                image: payload.picture,
            },
        });

        // Create session
        await createSession({ sub: user.id, email: user.email, name: user.name || '' });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
