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

/** LinkedIn إجباري في المسارات الثلاثة. */
const requiredLinkedin = z
  .string()
  .trim()
  .min(1, 'رابط LinkedIn مطلوب')
  .refine((v) => /^https?:\/\/([\w-]+\.)?linkedin\.com\/.+/i.test(v), {
    message: 'يرجى إدخال رابط LinkedIn صحيح (مثال: https://linkedin.com/in/username)',
  });

const phoneSchema = z
  .string()
  .trim()
  .min(1, 'رقم الجوال مطلوب')
  .refine((v) => /^(?:\+?966|0)5\d{8}$/.test(v.replace(/[\s-]/g, '')), {
    message: 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0512345678)',
  });

const bioSchema = z
  .string()
  .trim()
  .min(20, 'يرجى كتابة نبذة لا تقل عن 20 حرفاً')
  .max(600, 'النبذة طويلة جداً (600 حرف كحد أقصى)');

// ============================================================
// الخطوة الأولى المشتركة: بياناتك
// الاسم · البريد · الجوال · المنطقة · نبذة عنك
// ============================================================

export const identitySchema = z.object({
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
  region: z.string().min(1, 'يرجى اختيار المنطقة'),
  bio: bioSchema,
});
export type IdentityInput = z.infer<typeof identitySchema>;

// ============================================================
// المسار الأول: أبحث عن فرصة
// بياناتك → التفاصيل المهنية → الروابط والملفات
// ============================================================

export const seekerDetailsSchema = z.object({
  current_status: z.string().min(1, 'يرجى اختيار حالتك الحالية'),
  specialization: z.string().trim().min(2, 'التخصص مطلوب'),
  education_level: z.string().min(1, 'يرجى اختيار المؤهل العلمي'),
  target_job_title: z.string().trim().min(2, 'المسمى الوظيفي المستهدف مطلوب'),
  years_of_experience: z.string().min(1, 'يرجى اختيار سنوات الخبرة'),
  opportunity_preferences: z
    .array(z.string())
    .min(1, 'يرجى اختيار نوع فرصة واحد على الأقل'),
  skills: z.array(z.string()).min(1, 'يرجى اختيار مهارة واحدة على الأقل'),
});
export type SeekerDetailsInput = z.infer<typeof seekerDetailsSchema>;

export const seekerLinksSchema = z.object({
  cv_path: z.string().min(1, 'يرجى رفع السيرة الذاتية'),
  linkedin_url: requiredLinkedin,
  github_url: optionalUrl('يرجى إدخال رابط GitHub صحيح'),
  personal_website_url: optionalUrl('يرجى إدخال رابط صحيح للموقع الشخصي'),
});
export type SeekerLinksInput = z.infer<typeof seekerLinksSchema>;

// ============================================================
// المسار الثاني: خبير / مستشار
// بياناتك → البيانات المهنية → نوع المساهمة → الروابط والملفات
// ============================================================

export const expertProfessionalSchema = z.object({
  specialization: z.string().trim().min(2, 'التخصص مطلوب'),
  current_job_title: z.string().trim().min(2, 'المسمى الوظيفي الحالي مطلوب'),
  current_organization: z.string().trim().min(2, 'جهة العمل الحالية مطلوبة'),
  years_of_experience: z.string().min(1, 'يرجى اختيار سنوات الخبرة'),
  education_level: z.string().min(1, 'يرجى اختيار المؤهل العلمي'),
  skills: z.array(z.string()).min(1, 'يرجى اختيار مهارة واحدة على الأقل'),
});
export type ExpertProfessionalInput = z.infer<typeof expertProfessionalSchema>;

export const expertContributionSchema = z.object({
  contribution_types: z
    .array(z.string())
    .min(1, 'يرجى اختيار نوع مساهمة واحد على الأقل'),
  participation_mode: z.string().min(1, 'يرجى اختيار طريقة المشاركة'),
});
export type ExpertContributionInput = z.infer<typeof expertContributionSchema>;

export const expertLinksSchema = z.object({
  cv_path: z.string().min(1, 'يرجى رفع السيرة الذاتية'),
  linkedin_url: requiredLinkedin,
  personal_website_url: optionalUrl('يرجى إدخال رابط صحيح للموقع الشخصي'),
});
export type ExpertLinksInput = z.infer<typeof expertLinksSchema>;

// ============================================================
// المسار الثالث: التطوع
// بياناتك → نوع التطوع → تفاصيل المساهمة → الروابط والملفات
// ============================================================

export const volunteerTypeSchema = z.object({
  volunteer_types: z.array(z.string()).min(1, 'يرجى اختيار نوع تطوع واحد على الأقل'),
});
export type VolunteerTypeInput = z.infer<typeof volunteerTypeSchema>;

export const volunteerDetailsSchema = z.object({
  specialization: z.string().trim().optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'يرجى اختيار مهارة واحدة على الأقل'),
  years_of_experience: z.string().optional().or(z.literal('')),
  has_volunteered: z.string().optional().or(z.literal('')),
  weekly_hours: z.string().optional().or(z.literal('')),
  availability_times: z.array(z.string()).default([]),
  participation_mode: z.string().optional().or(z.literal('')),
  what_can_offer: z
    .string()
    .trim()
    .min(10, 'يرجى كتابة إجابة لا تقل عن 10 أحرف')
    .max(300, 'الحد الأقصى 300 حرف'),
});
export type VolunteerDetailsInput = z.infer<typeof volunteerDetailsSchema>;

/** في مسار التطوع: LinkedIn إجباري والسيرة الذاتية اختيارية. */
export const volunteerLinksSchema = z.object({
  linkedin_url: requiredLinkedin,
  cv_path: z.string().optional().or(z.literal('')),
  github_url: optionalUrl('يرجى إدخال رابط GitHub صحيح'),
  personal_website_url: optionalUrl('يرجى إدخال رابط صحيح للموقع الشخصي'),
});
export type VolunteerLinksInput = z.infer<typeof volunteerLinksSchema>;

// ============================================================
// دخول لوحة الإدارة
// ============================================================

export const adminLoginSchema = z.object({
  email: z.string().trim().min(1, 'البريد الإلكتروني مطلوب').email('بريد إلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
