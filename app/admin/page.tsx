import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminStaffForm from '@/components/admin-staff-form';
import LogoutButton from '@/components/logout-button';

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Double check admin status (although middleware checks presence, we check role here ideally)
    const adminEmails = ['chresouniversity2@gmail.com', 'datacenter@chresouniversity.edu.zm'];
    if (!adminEmails.includes(user.email || '')) {
        return (
            <div className="p-8 text-center text-red-600 font-bold">
                Access Denied: You are not authorized to view this page.
                <div className="mt-4"><LogoutButton /></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{user.email}</span>
                        <LogoutButton />
                    </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <AdminStaffForm />
                </div>
            </main>
        </div>
    );
}
