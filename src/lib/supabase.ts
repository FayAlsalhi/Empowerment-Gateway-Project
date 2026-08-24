import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[بوابة التمكين] لم يتم ضبط متغيرات Supabase. انسخ .env.example إلى .env واملأ VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY.'
  );
}

// A safe fallback keeps the app rendering (landing page, etc.) even before env is set.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'public-anon-placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  cvs: 'cvs',
  certificates: 'certificates',
  orgLogos: 'organization-logos',
  portfolio: 'portfolio-files',
} as const;
