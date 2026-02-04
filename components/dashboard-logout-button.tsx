'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="flex flex-col items-center mt-auto w-full">
            <div className="text-white text-lg mb-2">Logout</div>
            <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-white hover:bg-gray-100 hover:scale-105 active:scale-95 text-indigo-900 rounded-lg p-3 transition-transform duration-200 disabled:opacity-70 flex items-center justify-center w-16 h-16 shadow-lg"
                aria-label="Logout"
            >
                <LogOut size={32} strokeWidth={2.5} />
            </button>
        </div>
    );
}
