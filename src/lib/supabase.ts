import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    '%c[بوابة التمكين] متغيّرات Supabase غير مضبوطة!',
    'color:#fff;background:#c00;padding:2px 6px;border-radius:3px;font-weight:bold',
    [
      '',
      'النسخة المبنية لا تحتوي VITE_SUPABASE_URL أو VITE_SUPABASE_ANON_KEY.',
      'هذه القيم تُدمج وقت البناء (npm run build) وليس وقت التشغيل،',
      'فتأكد من وجود ملف .env قبل البناء ثم أعد رفع مجلد dist.',
    ].join('\n')
  );
} else {
  // طباعة الرابط تكشف فوراً ما إذا بُني الموقع بمفاتيح مشروع خاطئ
  // eslint-disable-next-line no-console
  console.info('[بوابة التمكين] Supabase:', supabaseUrl);
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
