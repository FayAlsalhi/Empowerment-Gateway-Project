import type { Option } from '@/types';

// ============================================================
// خيارات مشتركة
// ============================================================

export const SAUDI_REGIONS: Option[] = [
  'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'المنطقة الشرقية',
  'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف',
].map((r) => ({ value: r, label: r }));

// ============================================================
// مسار: أبحث عن فرصة
// ============================================================

export const CURRENT_STATUS_OPTIONS: Option[] = [
  { value: 'university_student', label: 'طالب جامعي' },
  { value: 'fresh_graduate', label: 'حديث تخرج' },
  { value: 'job_seeker', label: 'باحث عن عمل' },
  { value: 'employed_seeking', label: 'موظف وأبحث عن فرصة جديدة' },
  { value: 'freelancer', label: 'مستقل Freelancer' },
  { value: 'trainee', label: 'متدرب' },
];

export const OPPORTUNITY_PREFERENCES: Option[] = [
  { value: 'full_time', label: 'وظيفة بدوام كامل' },
  { value: 'part_time', label: 'وظيفة بدوام جزئي' },
  { value: 'coop', label: 'تدريب تعاوني' },
  { value: 'tamheer', label: 'تدريب تمهير' },
  { value: 'summer_training', label: 'تدريب صيفي' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'project_based', label: 'Project-Based' },
  { value: 'remote', label: 'Remote Opportunity' },
  { value: 'professional_development', label: 'تطوير مهني' },
  { value: 'qualification_programs', label: 'برامج تأهيل' },
  { value: 'training_programs', label: 'برامج تدريبية' },
];

export const WORK_MODE_OPTIONS: Option[] = [
  { value: 'onsite', label: 'حضوري' },
  { value: 'remote', label: 'عن بعد' },
  { value: 'hybrid', label: 'هجين Hybrid' },
  { value: 'no_preference', label: 'لا يوجد تفضيل' },
];

// ============================================================
// مسار: أساهم بخبرتي
// ============================================================

export const EMPLOYMENT_STATUS_OPTIONS: Option[] = [
  { value: 'employed', label: 'موظف' },
  { value: 'freelancer', label: 'مستقل Freelancer' },
  { value: 'business_owner', label: 'صاحب عمل' },
  { value: 'entrepreneur', label: 'رائد أعمال' },
  { value: 'academic', label: 'أكاديمي' },
  { value: 'consultant', label: 'مستشار' },
  { value: 'researcher', label: 'باحث' },
  { value: 'unemployed', label: 'غير موظف حالياً' },
  { value: 'other', label: 'أخرى' },
];

export const YEARS_OF_EXPERIENCE_OPTIONS: Option[] = [
  { value: 'less_than_1', label: 'أقل من سنة' },
  { value: '1_3', label: '1–3 سنوات' },
  { value: '4_6', label: '4–6 سنوات' },
  { value: '7_10', label: '7–10 سنوات' },
  { value: 'more_than_10', label: 'أكثر من 10 سنوات' },
];

export const EDUCATION_LEVEL_OPTIONS: Option[] = [
  { value: 'high_school', label: 'ثانوي' },
  { value: 'diploma', label: 'دبلوم' },
  { value: 'bachelor', label: 'بكالوريوس' },
  { value: 'master', label: 'ماجستير' },
  { value: 'phd', label: 'دكتوراه' },
  { value: 'other', label: 'أخرى' },
];

export const PARTICIPATION_TYPES: Option[] = [
  { value: 'trainer', label: 'مدرب' },
  { value: 'workshop_facilitator', label: 'مقدم ورشة' },
  { value: 'mentor', label: 'مرشد Mentor' },
  { value: 'consultant', label: 'مستشار' },
  { value: 'speaker', label: 'متحدث' },
  { value: 'judge', label: 'محكم' },
  { value: 'specialist', label: 'خبير متخصص' },
  { value: 'committee_member', label: 'عضو لجنة' },
];

export const EXPERT_AREAS: Option[] = [
  'الذكاء الاصطناعي', 'علوم البيانات', 'تطوير البرمجيات', 'الأمن السيبراني',
  'ريادة الأعمال', 'إدارة المشاريع', 'إدارة المنتجات', 'التسويق',
  'التجارة الإلكترونية', 'تطوير الأعمال', 'القيادة', 'الموارد البشرية',
  'التصميم', 'صناعة المحتوى', 'المالية', 'أخرى',
].map((a) => ({ value: a, label: a }));

export const CONTRIBUTION_TYPES: Option[] = [
  { value: 'training', label: 'تدريب' },
  { value: 'mentoring', label: 'إرشاد' },
  { value: 'consulting', label: 'استشارات' },
  { value: 'specialized_sessions', label: 'جلسات تخصصية' },
  { value: 'workshops', label: 'ورش عمل' },
  { value: 'judging', label: 'تحكيم' },
  { value: 'speaking', label: 'مشاركة كمتحدث' },
];

export const TARGET_AUDIENCES: Option[] = [
  { value: 'children', label: 'الأطفال والناشئون' },
  { value: 'school_students', label: 'طلاب المدارس' },
  { value: 'university_students', label: 'طلاب الجامعات' },
  { value: 'fresh_graduates', label: 'حديثو التخرج' },
  { value: 'job_seekers', label: 'الباحثون عن عمل' },
  { value: 'employees', label: 'الموظفون' },
  { value: 'entrepreneurs', label: 'رواد الأعمال' },
  { value: 'nonprofits', label: 'الجهات غير الربحية' },
  { value: 'disabled', label: 'ذوو الإعاقة' },
  { value: 'general', label: 'عامة' },
];

export const DELIVERY_MODE_OPTIONS: Option[] = [
  { value: 'onsite', label: 'حضوري' },
  { value: 'remote', label: 'عن بعد' },
  { value: 'both', label: 'كلاهما' },
];

// ============================================================
// مسار: أتطوع
// ============================================================

export const VOLUNTEER_TYPE_OPTIONS: Option[] = [
  { value: 'specialized', label: 'تطوع تخصصي' },
  { value: 'operational', label: 'تطوع تشغيلي' },
  { value: 'both', label: 'كلاهما' },
];

export const SPECIALIZED_INTERESTS: Option[] = [
  'تدريب', 'تصميم', 'تصوير', 'صناعة محتوى', 'تقنية',
  'تطوير', 'تسويق', 'ترجمة', 'تقديم', 'إرشاد', 'أخرى',
].map((i) => ({ value: i, label: i }));

export const OPERATIONAL_INTERESTS: Option[] = [
  'تنظيم', 'استقبال', 'تسجيل', 'تنسيق', 'دعم فعاليات',
  'ضيافة', 'لوجستيات', 'توثيق', 'أخرى',
].map((i) => ({ value: i, label: i }));

// ============================================================
// نصوص شاشة النجاح لكل مسار
// ============================================================

export const SUCCESS_MESSAGES: Record<
  'opportunity_seeker' | 'expert' | 'volunteer',
  { title: string; message: string }
> = {
  opportunity_seeker: {
    title: 'أهلاً بك في بوابة التمكين',
    message:
      'تم استلام ملفك بنجاح. أصبحت الآن ضمن قاعدة الكفاءات في بوابة التمكين، وسنتواصل معك عند وجود فرصة مناسبة لاهتماماتك المهنية.',
  },
  expert: {
    title: 'شكراً لمشاركة خبرتك معنا',
    message:
      'تم تسجيل ملفك ضمن شبكة خبراء بوابة التمكين، وسنتواصل معك عند وجود فرص تدريب أو إرشاد أو استشارات مناسبة لخبرتك.',
  },
  volunteer: {
    title: 'أهلاً بك ضمن مجتمع المتطوعين',
    message:
      'تم تسجيل بياناتك بنجاح، وسنتواصل معك عند توفر فرص تطوعية مناسبة.',
  },
};

/** البحث عن التسمية العربية لقيمة مخزّنة. */
export function labelFor(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
