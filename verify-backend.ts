import { prisma } from './lib/db';

async function verify() {
    console.log('1. Testing Login API with Mock Credential...');

    try {
        const res = await fetch('http://localhost:3000/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000', // Pass CSRF check
            },
            body: JSON.stringify({ credential: 'mock_credential' }),
        });

        if (!res.ok) {
            console.error('API Request Failed:', res.status, await res.text());
            process.exit(1);
        }

        const data = await res.json();
        console.log('API Response:', data);

        const cookie = res.headers.get('set-cookie');
        if (cookie && cookie.includes('session=')) {
            console.log('✅ Session Cookie Set:', cookie.split(';')[0]);
        } else {
            console.error('❌ Session Cookie Missing');
            process.exit(1);
        }

        console.log('2. Verifying Database Record...');
        const user = await prisma.user.findUnique({
            where: { googleId: 'mock_user_123' },
        });

        if (user) {
            console.log('✅ User Found in DB:', user);
        } else {
            console.error('❌ User NOT Found in DB');
            process.exit(1);
        }

        console.log('Backend Verification Successful!');
    } catch (error) {
        console.error('Verification Error:', error);
        process.exit(1);
    }
}

verify();
