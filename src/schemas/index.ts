import { z } from 'zod';

// ============================================================
// أدوات مشتركة
// ============================================================

const optionalUrl = (message: string) =>
  z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || /^https?:\/\/.+\..+/.test(v), { message });

/** رقم جوال سعودي: 05xxxxxxxx أو +9665xxxxxxxx أو 9665xxxxxxxx */
const phoneSchema = z
  .string()
  .trim()
  .min(1, 'رقم الجوال مطلوب')
  .refine((v) => /^(?:\+?966|0)5\d{8}$/.test(v.replace(/[\s-]/g, '')), {
    message: 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0512345678)',
  });

// ============================================================
// الخطوة المشتركة: المعلومات الشخصية
// ============================================================

export const personalInfoSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, 'يرجى إدخال الاسم الكامل')
    .max(100, 'الاسم طويل جداً'),
  email: z
    .string()
    .trim()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('يرجى إدخال بريد إلكتروني صحيح'),
  phone: phoneSchema,
  city: z.string().trim().min(2, 'المدينة مطلوبة'),
  region: z.string().min(1, 'يرجى اختيار المنطقة'),
  bio: z
    .string()
    .trim()
    .min(20, 'يرجى كتابة نبذة لا تقل عن 20 حرفاً')
    .max(600, 'النبذة طويلة جداً (600 حرف كحد أقصى)'),
  professional_headline: z
    .string()
    .trim()
    .min(3, 'العنوان المهني مطلوب')
    .max(120, 'العنوان المهني طويل جداً'),
});
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;

/** نسخة المتطوع: النبذة والعنوان المهني اختياريان. */
export const volunteerPersonalInfoSchema = personalInfoSchema.extend({
  bio: z.string().trim().max(600, 'النبذة طويلة جداً').optional().or(z.literal('')),
  professional_headline: z.string().trim().optional().or(z.literal('')),
});
export type VolunteerPersonalInfoInput = z.infer<typeof volunteerPersonalInfoSchema>;

// ============================================================
// الخطوة المشتركة: الروابط والملفات
// ============================================================

export const linksSchema = z.object({
  linkedin_url: z
    .string()
    .trim()
    .min(1, 'رابط LinkedIn مطلوب')
    .refine((v) => /^https?:\/\/([\w-]+\.)?linkedin\.com\/.+/i.test(v), {
      message: 'يرجى إدخال رابط LinkedIn صحيح (مثال: https://linkedin.com/in/username)',
    }),
  portfolio_url: optionalUrl('يرجى إدخال رابط صحيح لمعرض الأعمال'),
  personal_website_url: optionalUrl('يرجى إدخال رابط صحيح للموقع الشخصي'),
  github_url: optionalUrl('يرجى إدخال رابط GitHub صحيح'),
  cv_path: z.string().min(1, 'يرجى رفع السيرة الذاتية'),
});
export type LinksInput = z.infer<typeof linksSchema>;

// ============================================================
// مسار: أبحث عن فرصة
// ============================================================

export const seekerPreferencesSchema = z.object({
  current_status: z.string().min(1, 'يرجى اختيار حالتك الحالية'),
  opportunity_preferences: z
    .array(z.string())
    .min(1, 'يرجى اختيار نوع فرصة واحد على الأقل'),
  preferred_work_mode: z.string().min(1, 'يرجى اختيار نمط العمل المفضل'),
});
export type SeekerPreferencesInput = z.infer<typeof seekerPreferencesSchema>;

// ============================================================
// مسار: أساهم بخبرتي
// ============================================================

export const expertProfessionalSchema = z.object({
  current_job_title: z.string().trim().min(2, 'المسمى المهني الحالي مطلوب'),
  current_organization: z.string().trim().optional().or(z.literal('')),
  employment_status: z.string().min(1, 'يرجى اختيار الحالة الوظيفية'),
  years_of_experience: z.string().min(1, 'يرجى اختيار سنوات الخبرة'),
  education_level: z.string().min(1, 'يرجى اختيار المؤهل العلمي'),
  specialization: z.string().trim().min(2, 'التخصص مطلوب'),
});
export type ExpertProfessionalInput = z.infer<typeof expertProfessionalSchema>;

export const expertContributionSchema = z.object({
  participation_types: z
    .array(z.string())
    .min(1, 'يرجى اختيار نوع مشاركة واحد على الأقل'),
  areas: z.array(z.string()).min(1, 'يرجى اختيار مجال واحد على الأقل'),
  contribution_types: z
    .array(z.string())
    .min(1, 'يرجى اختيار نوع مساهمة واحد على الأقل'),
  target_audiences: z
    .array(z.string())
    .min(1, 'يرجى اختيار فئة مستهدفة واحدة على الأقل'),
  delivery_mode: z.string().min(1, 'يرجى اختيار طريقة المشاركة'),
});
export type ExpertContributionInput = z.infer<typeof expertContributionSchema>;

// ============================================================
// مسار: أتطوع
// ============================================================

export const volunteerDetailsSchema = z
  .object({
    volunteer_type: z.string().min(1, 'يرجى اختيار نوع التطوع'),
    interests: z.array(z.string()).min(1, 'يرجى اختيار مجال واحد على الأقل'),
  });
export type VolunteerDetailsInput = z.infer<typeof volunteerDetailsSchema>;
