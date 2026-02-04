import { OAuth2Client } from 'google-auth-library';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'default_secret');
const ALG = 'HS256';

export async function verifyGoogleToken(token: string) {
    if (process.env.MOCK_GOOGLE_TOKEN_ALLOWED === 'true' && token === 'mock_credential') {
        return {
            sub: 'mock_user_123',
            email: 'mock@example.com',
            name: 'Mock User',
            picture: 'https://via.placeholder.com/150',
        };
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        console.error('Google token verification failed:', error);
        return null;
    }
}

export interface UserSession {
    sub: string;
    email: string;
    name: string;
}

export async function createSession(payload: UserSession) {
    const jwt = await new SignJWT(payload as any)
        .setProtectedHeader({ alg: ALG })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set('session', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function getSession(): Promise<UserSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as unknown as UserSession;
    } catch (error) {
        return null;
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
