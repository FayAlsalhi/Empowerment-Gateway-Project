// ============================================================================
// جمعية القصيم التقنية — دالة إرسال بريد الترحيب
//
// تعمل على الخادم (Supabase Edge Function) فقط. تستقبل معرّف الملف، تقرأ
// البيانات بصلاحية الخدمة، ثم ترسل البريد. لا تُمرَّر أي بيانات شخصية من
// المتصفح، ولا توجد أي كلمة مرور داخل الكود — كلها من متغيّرات البيئة.
//
// النشر:  supabase functions deploy send-welcome-email
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { sendMail } from './smtp.ts';
import { ORG, type ProfileType } from './config.ts';
import { renderWelcomeEmail, renderWelcomeText } from './template.ts';

const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const { profile_id } = await req.json();
    if (!profile_id || typeof profile_id !== 'string') {
      return json({ error: 'profile_id مطلوب' }, 400);
    }

    // --- قراءة الملف بصلاحية الخدمة (تتجاوز RLS بأمان داخل الخادم) ---
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, email, profile_type')
      .eq('id', profile_id)
      .single();

    if (error || !profile) return json({ error: 'الملف غير موجود' }, 404);

    // --- إعدادات SMTP من متغيّرات البيئة فقط ---
    // الافتراضي Microsoft 365 (بريد النطاق) — يمكن تغييره من الأسرار
    const host = Deno.env.get('SMTP_HOST') ?? 'smtp.office365.com';
    const port = Number(Deno.env.get('SMTP_PORT') ?? '587');
    const user = Deno.env.get('SMTP_USER');
    const pass = Deno.env.get('SMTP_PASS');
    const from = Deno.env.get('MAIL_FROM') ?? user;

    if (!user || !pass) {
      console.error('SMTP_USER / SMTP_PASS غير مضبوطة — تم تخطي الإرسال.');
      return json({ sent: false, reason: 'smtp_not_configured' }, 200);
    }

    const type = profile.profile_type as ProfileType;

    await sendMail({
      hostname: host,
      port,
      username: user,
      password: pass,
      fromEmail: from!,
      fromName: ORG.nameAr,
      to: profile.email,
      subject: `أهلاً بك في مجتمع ${ORG.nameAr}`,
      text: renderWelcomeText(profile.full_name, type),
      html: renderWelcomeEmail(profile.full_name, type),
    });
    return json({ sent: true });
  } catch (err) {
    // لا نُفشل التسجيل بسبب البريد — نسجّل الخطأ فقط
    console.error('فشل إرسال البريد:', err);
    return json({ sent: false, error: String(err) }, 200);
  }
});
