import { supabase } from '@/lib/supabase';
import type { SubmissionPayload } from '@/types';

export const CV_BUCKET = 'cvs';
const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB

/** خطأ يحمل رسالة عربية جاهزة للعرض. */
export class SubmissionError extends Error {
  constructor(message: string, readonly code?: string) {
    super(message);
    this.name = 'SubmissionError';
  }
}

/**
 * رفع السيرة الذاتية (PDF فقط) إلى حاوية خاصة.
 * ترجع مسار التخزين — الحاوية غير عامة ولا يمكن قراءتها من الواجهة.
 */
export async function uploadCv(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (ext !== 'pdf' || file.type !== 'application/pdf') {
    throw new SubmissionError('يُقبل ملف PDF فقط. يرجى تحويل الملف ثم إعادة الرفع.');
  }
  if (file.size > MAX_CV_BYTES) {
    throw new SubmissionError('حجم الملف يتجاوز 5 ميجابايت. يرجى رفع ملف أصغر.');
  }
  if (file.size === 0) {
    throw new SubmissionError('الملف فارغ. يرجى اختيار ملف صحيح.');
  }

  // اسم فريد لكل ملف حتى لا تتصادم الأسماء ولا يمكن تخمين مسارات الآخرين
  const path = `${crypto.randomUUID()}/${Date.now()}.pdf`;

  const { error } = await supabase.storage
    .from(CV_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: 'application/pdf' });

  if (error) {
    throw new SubmissionError('تعذّر رفع السيرة الذاتية. يرجى المحاولة مرة أخرى.');
  }
  return path;
}

/** حذف ملف مرفوع (عند استبداله قبل الإرسال). */
export async function removeCv(path: string): Promise<void> {
  await supabase.storage.from(CV_BUCKET).remove([path]);
}

/**
 * إرسال بريد الترحيب. يعمل على الخادم (Edge Function) بالكامل —
 * لا تُمرَّر أي بيانات شخصية من المتصفح، فقط معرّف الملف.
 * الفشل هنا لا يُبطل التسجيل.
 */
async function sendWelcomeEmail(profileId: string): Promise<void> {
  try {
    await supabase.functions.invoke('send-welcome-email', {
      body: { profile_id: profileId },
    });
  } catch {
    /* البريد إضافة، وليس شرطاً لنجاح التسجيل */
  }
}

/**
 * حفظ الملف كاملاً في معاملة واحدة عبر RPC، ثم إرسال بريد الترحيب.
 * ترجع معرّف الملف الجديد.
 */
export async function submitProfile(payload: SubmissionPayload): Promise<string> {
  const { data, error } = await supabase.rpc('submit_profile', {
    payload: payload as unknown as Record<string, unknown>,
  });

  if (error) {
    throw new SubmissionError('تعذّر حفظ بياناتك. يرجى المحاولة مرة أخرى.');
  }

  const profileId = data as string;
  void sendWelcomeEmail(profileId);
  return profileId;
}
