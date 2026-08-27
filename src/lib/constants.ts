import type { Option } from '@/types';

// ============================================================
// مشترك
// ============================================================

/** مناطق المملكة الـ13 — لا تُجمع المدينة إطلاقاً. */
export const SAUDI_REGIONS: Option[] = [
  'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'المنطقة الشرقية',
  'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف',
].map((r) => ({ value: r, label: r }));

export const EDUCATION_LEVEL_OPTIONS: Option[] = [
  { value: 'high_school', label: 'ثانوي' },
  { value: 'diploma', label: 'دبلوم' },
  { value: 'bachelor', label: 'بكالوريوس' },
  { value: 'master', label: 'ماجستير' },
  { value: 'phd', label: 'دكتوراه' },
  { value: 'other', label: 'أخرى' },
];

export const YEARS_OF_EXPERIENCE_OPTIONS: Option[] = [
  { value: 'none', label: 'لا توجد خبرة' },
  { value: 'less_than_1', label: 'أقل من سنة' },
  { value: '1_3', label: '1–3 سنوات' },
  { value: '4_6', label: '4–6 سنوات' },
  { value: '7_10', label: '7–10 سنوات' },
  { value: 'more_than_10', label: 'أكثر من 10 سنوات' },
];

/** التخصصات — قائمة قابلة للبحث مع إمكانية الكتابة الحرة. */
export const SPECIALIZATIONS: Option[] = [
  'علوم الحاسب', 'هندسة البرمجيات', 'نظم المعلومات', 'الأمن السيبراني',
  'الذكاء الاصطناعي', 'علوم البيانات', 'الشبكات', 'الحوسبة السحابية',
  'هندسة الحاسب', 'الهندسة الكهربائية', 'تقنية المعلومات',
  'تجربة وواجهة المستخدم', 'التصميم الجرافيكي', 'الوسائط المتعددة',
  'إدارة الأعمال', 'التسويق', 'المالية', 'الإعلام والاتصال', 'أخرى',
].map((s) => ({ value: s, label: s }));

/** المهارات — منفصلة عن التخصص، متعددة الاختيار مع إضافة حرة. */
export const SKILLS: Option[] = [
  'React', 'Next.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#',
  'Node.js', 'SQL', 'AI', 'Machine Learning', 'Data Analysis', 'Power BI',
  'Cybersecurity', 'Cloud', 'AWS', 'Azure', 'DevOps', 'Flutter', 'Mobile Development',
  'UI/UX', 'Figma', 'Graphic Design', 'Video Editing', 'Photography',
  'Content Creation', 'Marketing', 'Digital Marketing', 'Project Management',
  'Product Management', 'Business Analysis', 'Public Speaking', 'Training',
  'Event Management', 'Translation',
].map((s) => ({ value: s, label: s }));

export const PARTICIPATION_MODE_OPTIONS: Option[] = [
  { value: 'onsite', label: 'حضوري' },
  { value: 'remote', label: 'عن بُعد' },
  { value: 'both', label: 'كلاهما' },
];

// ============================================================
// المسار الأول: أبحث عن فرصة
// ============================================================

export const CURRENT_STATUS_OPTIONS: Option[] = [
  { value: 'university_student', label: 'طالب جامعي' },
  { value: 'fresh_graduate', label: 'حديث تخرج' },
  { value: 'employed_seeking', label: 'موظف وأبحث عن فرصة أخرى' },
  { value: 'freelancer', label: 'مستقل Freelancer' },
  { value: 'business_owner', label: 'صاحب مشروع' },
];

export const OPPORTUNITY_TYPE_OPTIONS: Option[] = [
  { value: 'job', label: 'وظيفة' },
  { value: 'coop', label: 'تدريب تعاوني' },
  { value: 'tamheer', label: 'تمهير' },
  { value: 'professional_training', label: 'تدريب مهني' },
  { value: 'freelance', label: 'عمل حر / مشاريع' },
  { value: 'other', label: 'أخرى' },
];

// ============================================================
// المسار الثاني: خبير / مستشار
// ============================================================

export const CONTRIBUTION_TYPES: Option[] = [
  { value: 'workshops', label: 'تقديم ورش ولقاءات' },
  { value: 'mentoring', label: 'الإرشاد Mentoring' },
  { value: 'consulting', label: 'الاستشارات' },
  { value: 'judging', label: 'التحكيم وتقييم المشاريع' },
  { value: 'committees', label: 'المشاركة في لجان أو جلسات تخصصية' },
  { value: 'other', label: 'أخرى' },
];

// ============================================================
// المسار الثالث: التطوع
// ============================================================

export const VOLUNTEER_TYPE_OPTIONS: Option[] = [
  { value: 'technical', label: 'تطوع تخصصي تقني' },
  { value: 'events', label: 'تنظيم وتشغيل فعاليات' },
  { value: 'media', label: 'إعلام وصناعة محتوى' },
  { value: 'photography', label: 'تصوير ومونتاج' },
  { value: 'design', label: 'تصميم' },
  { value: 'partnerships', label: 'علاقات وشراكات' },
  { value: 'hosting', label: 'تقديم وتنسيق لقاءات' },
  { value: 'admin_support', label: 'دعم إداري' },
  { value: 'other', label: 'أخرى' },
];

export const WEEKLY_HOURS_OPTIONS: Option[] = [
  { value: '1_3', label: '1–3 ساعات' },
  { value: '4_6', label: '4–6 ساعات' },
  { value: '7_10', label: '7–10 ساعات' },
  { value: 'more_than_10', label: 'أكثر من 10 ساعات' },
];

export const AVAILABILITY_TIMES: Option[] = [
  { value: 'weekday_morning', label: 'أيام الأسبوع صباحاً' },
  { value: 'weekday_evening', label: 'أيام الأسبوع مساءً' },
  { value: 'weekend', label: 'نهاية الأسبوع' },
  { value: 'flexible', label: 'مرن' },
];

export const HAS_VOLUNTEERED_OPTIONS: Option[] = [
  { value: 'true', label: 'نعم، سبق لي التطوع' },
  { value: 'false', label: 'لا، هذه أول مرة' },
];

// ============================================================
// الحالة الداخلية (لوحة الإدارة فقط — لا تظهر للمستخدم)
// ============================================================

export const INTERNAL_STATUS_OPTIONS: Option[] = [
  { value: 'new', label: 'جديد' },
  { value: 'reviewed', label: 'تمت المراجعة' },
  { value: 'shortlisted', label: 'مرشح' },
  { value: 'contacted', label: 'تم التواصل' },
  { value: 'matched', label: 'تمت المطابقة' },
  { value: 'archived', label: 'مؤرشف' },
];

export const INTERNAL_STATUS_VARIANT: Record<
  string,
  'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'accent'
> = {
  new: 'secondary',
  reviewed: 'default',
  shortlisted: 'accent',
  contacted: 'warning',
  matched: 'success',
  archived: 'destructive',
};

// ============================================================
// رسائل النجاح — قصيرة وحديثة
// ============================================================

export const SUCCESS_MESSAGES: Record<
  'opportunity_seeker' | 'expert' | 'volunteer',
  { title: string; message: string }
> = {
  opportunity_seeker: {
    title: 'تم تسجيلك بنجاح ✨',
    message:
      'تمت إضافة بياناتك إلى مجتمع المواهب لدى جمعية القصيم التقنية، وقد نتواصل معك عند توفر فرصة تتناسب مع ملفك.',
  },
  expert: {
    title: 'تم تسجيلك بنجاح ✨',
    message:
      'شكراً لمشاركتك خبراتك معنا. تم استلام بياناتك، وقد نتواصل معك عند وجود برنامج أو مشاركة تتناسب مع خبرتك.',
  },
  volunteer: {
    title: 'تم تسجيلك بنجاح ✨',
    message:
      'يسعدنا انضمامك إلى مجتمع متطوعي جمعية القصيم التقنية. تم استلام بياناتك وسنتواصل معك عند وجود فرصة تطوعية مناسبة.',
  },
};

/** التسمية العربية لقيمة مخزّنة. */
export function labelFor(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** تسميات متعددة مفصولة. */
export function labelsFor(options: Option[], values: string[] | null | undefined): string {
  if (!values || values.length === 0) return '—';
  return values.map((v) => labelFor(options, v)).join(' · ');
}
