import { createClient } from '@supabase/supabase-js';

// WARNING: This client uses the Service Role Key.
// It MUST ANY ONLY be used in secure API routes (Backend).
// NEVER expose this to the client/browser.

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
