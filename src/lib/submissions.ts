import { supabase } from '@/lib/supabase';
import type { ProfileType, SubmissionPayload } from '@/types';

export const CV_BUCKET = 'cvs';
const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_CV_EXTENSIONS = ['pdf', 'doc', 'docx'];

/** خطأ يحمل رسالة عربية جاهزة للعرض. */
export class SubmissionError extends Error {
  constructor(message: string, readonly code?: string) {
    super(message);
    this.name = 'SubmissionError';
  }
}

/**
 * رفع السيرة الذاتية إلى حاوية خاصة.
 * ترجع مسار التخزين (وليس رابطاً) — الحاوية غير عامة.
 */
export async function uploadCv(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (!ALLOWED_CV_EXTENSIONS.includes(ext)) {
    throw new SubmissionError('صيغة الملف غير مدعومة. يُقبل PDF أو DOC أو DOCX فقط.');
  }
  if (file.size > MAX_CV_BYTES) {
    throw new SubmissionError('حجم الملف يتجاوز 5 ميجابايت. يرجى رفع ملف أصغر.');
  }

  // مجلد عشوائي لكل رفع حتى لا يمكن تخمين مسارات الآخرين
  const path = `${crypto.randomUUID()}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(CV_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    throw new SubmissionError('تعذّر رفع السيرة الذاتية. يرجى المحاولة مرة أخرى.');
  }
  return path;
}

/** حذف ملف تم رفعه (يُستخدم عند استبدال الملف قبل الإرسال). */
export async function removeCv(path: string): Promise<void> {
  await supabase.storage.from(CV_BUCKET).remove([path]);
}

/**
 * فحص ما إذا كان الشخص مسجلاً مسبقاً في نفس المسار.
 * تمر عبر RPC آمنة ترجع boolean فقط دون كشف أي بيانات.
 */
export async function checkDuplicate(
  email: string,
  phone: string,
  profileType: ProfileType
): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_profile_exists', {
    p_email: email,
    p_phone: phone,
    p_type: profileType,
  });

  // لا نمنع الإرسال بسبب فشل الفحص — الدالة نفسها تتحقق مرة أخرى عند الحفظ
  if (error) return false;
  return Boolean(data);
}

/**
 * حفظ الملف كاملاً في معاملة واحدة عبر RPC.
 * ترجع معرّف الملف الجديد.
 */
export async function submitProfile(payload: SubmissionPayload): Promise<string> {
  const { data, error } = await supabase.rpc('submit_profile', {
    payload: payload as unknown as Record<string, unknown>,
  });

  if (error) {
    if (error.message.includes('DUPLICATE_PROFILE')) {
      throw new SubmissionError(
        'يبدو أنك مسجّل مسبقاً بهذا البريد أو رقم الجوال في هذا المسار.',
        'DUPLICATE'
      );
    }
    throw new SubmissionError('تعذّر حفظ بياناتك. يرجى المحاولة مرة أخرى.');
  }

  return data as string;
}
