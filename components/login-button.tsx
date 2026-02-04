'use client';

import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginButton() {
    const router = useRouter();
    const [error, setError] = useState('');

    const handleCredentialResponse = useCallback(
        async (response: any) => {
            try {
                const res = await fetch('/api/auth/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ credential: response.credential }),
                });

                if (res.ok) {
                    router.push('/');
                    router.refresh();
                } else {
                    setError('Login failed');
                    console.error('Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                setError('Login error');
            }
        },
        [router]
    );

    // Expose handler to window
    useEffect(() => {
        (window as any).handleCredentialResponse = handleCredentialResponse;
    }, [handleCredentialResponse]);

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Script loads the GSI library */}
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="lazyOnload"
                onLoad={() => {
                    const google = (window as any).google;
                    if (google) {
                        google.accounts.id.initialize({
                            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'mock_client_id',
                            callback: (window as any).handleCredentialResponse,
                        });
                        google.accounts.id.renderButton(
                            document.getElementById('google-btn'),
                            { theme: 'outline', size: 'large', width: 250 }
                        );
                    }
                }}
            />

            <div id="google-btn" className="min-h-[40px]"></div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Dev Only: Mock Login Trigger because proper GSI needs real Client ID */}
            {process.env.NODE_ENV !== 'production' && (
                <button
                    onClick={() => handleCredentialResponse({ credential: 'mock_credential' })}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                    (Dev: Simulate Login)
                </button>
            )}
        </div>
    );
}
