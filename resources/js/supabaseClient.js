import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://joblifyr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Trigger real Google OAuth Sign In / Sign Up via Supabase Auth
 * Supabase handles anti-collision matching: if account registered via form email,
 * signing in with Google using the same email automatically links to the user account.
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.error('Supabase Google OAuth Error:', error.message);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Google Sign In Exception:', err);
    return { success: false, error: err };
  }
}
