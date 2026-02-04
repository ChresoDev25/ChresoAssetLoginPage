import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Requester is an Authenticated Admin
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const adminEmails = [
            'chresouniversity2@gmail.com',
            'datacenter@chresouniversity.edu.zm'
        ];

        if (!adminEmails.includes(user.email || '')) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        // 2. Parse Request
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // 3. Domain Validation (Redundant with DB Trigger, but good for API feedback)
        if (!email.endsWith('@chresouniversity.edu.zm')) {
            return NextResponse.json({ error: 'Invalid Domain: Must be @chresouniversity.edu.zm' }, { status: 400 });
        }

        // 4. Create User with Service Role
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm since Admin created it
            user_metadata: { role: 'staff' }
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, user: data.user });

    } catch (error) {
        console.error('Admin Create Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
