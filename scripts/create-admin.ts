import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function main() {
    const email = 'chresouniversity2@gmail.com'; // Root Admin
    // Get password from CLI arg or fallback
    const password = process.argv[2] || 'TempPass123!';

    console.log(`Attempting to create/update Admin user: ${email}`);

    // Checks if user exists first to avoid error spam
    // Note: listUsers requires service role
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError.message);
        process.exit(1);
    }

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        console.log(`User ${email} already exists (ID: ${existingUser.id}). Updating password...`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password, email_confirm: true, user_metadata: { role: 'admin' } }
        );
        if (updateError) {
            console.error('Failed to update password:', updateError.message);
        } else {
            console.log('✅ Password updated successfully!');
            console.log(`👉 You can now log in with: ${email} / ${password}`);
        }
    } else {
        // Create new user
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin' }
        });

        if (error) {
            console.error('Failed to create admin:', error.message);
            console.log('Ensure you have run the "secure_auth.sql" migration and that your triggers allow this email.');
        } else {
            console.log('✅ Admin user created successfully!');
            console.log(`👉 You can now log in with: ${email} / ${password}`);
        }
    }
}

main();
