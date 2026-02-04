'use client';

import { useState } from 'react';

export default function AdminStaffForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/create-staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `Success! Staff account created for ${data.user.email}` });
                setEmail('');
                setPassword('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to create account' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network or Server Error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Provision New Staff Account</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Create a new account for IT Staff. Email must be @chresouniversity.edu.zm.</p>
                </div>
                <form className="mt-5 space-y-4" onSubmit={handleCreate}>
                    <div>
                        <label htmlFor="staff-email" className="block text-sm font-medium text-gray-700">
                            Staff Email
                        </label>
                        <div className="mt-1">
                            <input
                                type="email"
                                name="staff-email"
                                id="staff-email"
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="user@chresouniversity.edu.zm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="staff-password" className="block text-sm font-medium text-gray-700">
                            Initial Password
                        </label>
                        <div className="mt-1">
                            <input
                                type="text" // Visible for admin to copy
                                name="staff-password"
                                id="staff-password"
                                required
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="StrongPassword123!"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                    >
                        {loading ? ' provisioning...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
