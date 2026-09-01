import type { BiOption } from './types';

/**
 * كل القوائم بمفاتيح ثابتة تُخزَّن في قاعدة البيانات،
 * مع تسمية عربية وأخرى إنجليزية للعرض فقط.
 *
 * ⚠️ لا تغيّر قيمة `value` بعد النشر — فهي المخزَّنة في الصفوف.
 */

export const REGIONS: BiOption[] = [
  { value: 'riyadh',        ar: 'الرياض',           en: 'Riyadh' },
  { value: 'makkah',        ar: 'مكة المكرمة',      en: 'Makkah' },
  { value: 'madinah',       ar: 'المدينة المنورة',  en: 'Madinah' },
  { value: 'qassim',        ar: 'القصيم',           en: 'Qassim' },
  { value: 'eastern',       ar: 'المنطقة الشرقية',  en: 'Eastern Province' },
  { value: 'asir',          ar: 'عسير',             en: 'Asir' },
  { value: 'tabuk',         ar: 'تبوك',             en: 'Tabuk' },
  { value: 'hail',          ar: 'حائل',             en: 'Hail' },
  { value: 'northern',      ar: 'الحدود الشمالية',  en: 'Northern Borders' },
  { value: 'jazan',         ar: 'جازان',            en: 'Jazan' },
  { value: 'najran',        ar: 'نجران',            en: 'Najran' },
  { value: 'bahah',         ar: 'الباحة',           en: 'Al Bahah' },
  { value: 'jawf',          ar: 'الجوف',            en: 'Al Jawf' },
];

export const EDUCATION_LEVELS: BiOption[] = [
  { value: 'high_school', ar: 'ثانوي',     en: 'High school' },
  { value: 'diploma',     ar: 'دبلوم',     en: 'Diploma' },
  { value: 'bachelor',    ar: 'بكالوريوس', en: "Bachelor's" },
  { value: 'master',      ar: 'ماجستير',   en: "Master's" },
  { value: 'phd',         ar: 'دكتوراه',   en: 'PhD' },
  { value: 'other',       ar: 'أخرى',      en: 'Other' },
];

export const YEARS_OF_EXPERIENCE: BiOption[] = [
  { value: 'none',         ar: 'لا توجد خبرة',       en: 'No experience' },
  { value: 'less_than_1',  ar: 'أقل من سنة',         en: 'Less than 1 year' },
  { value: '1_3',          ar: '1–3 سنوات',          en: '1–3 years' },
  { value: '4_6',          ar: '4–6 سنوات',          en: '4–6 years' },
  { value: '7_10',         ar: '7–10 سنوات',         en: '7–10 years' },
  { value: 'more_than_10', ar: 'أكثر من 10 سنوات',   en: 'More than 10 years' },
];

export const SPECIALIZATIONS: BiOption[] = [
  { value: 'computer_science',   ar: 'علوم الحاسب',            en: 'Computer Science' },
  { value: 'software_eng',       ar: 'هندسة البرمجيات',        en: 'Software Engineering' },
  { value: 'information_systems',ar: 'نظم المعلومات',          en: 'Information Systems' },
  { value: 'cybersecurity',      ar: 'الأمن السيبراني',        en: 'Cybersecurity' },
  { value: 'ai',                 ar: 'الذكاء الاصطناعي',       en: 'Artificial Intelligence' },
  { value: 'data_science',       ar: 'علوم البيانات',          en: 'Data Science' },
  { value: 'networks',           ar: 'الشبكات',                en: 'Networks' },
  { value: 'cloud',              ar: 'الحوسبة السحابية',       en: 'Cloud Computing' },
  { value: 'computer_eng',       ar: 'هندسة الحاسب',           en: 'Computer Engineering' },
  { value: 'electrical_eng',     ar: 'الهندسة الكهربائية',     en: 'Electrical Engineering' },
  { value: 'it',                 ar: 'تقنية المعلومات',        en: 'Information Technology' },
  { value: 'ux_ui',              ar: 'تجربة وواجهة المستخدم',  en: 'UX / UI' },
  { value: 'graphic_design',     ar: 'التصميم الجرافيكي',      en: 'Graphic Design' },
  { value: 'multimedia',         ar: 'الوسائط المتعددة',       en: 'Multimedia' },
  { value: 'business',           ar: 'إدارة الأعمال',          en: 'Business Administration' },
  { value: 'marketing',          ar: 'التسويق',                en: 'Marketing' },
  { value: 'finance',            ar: 'المالية',                en: 'Finance' },
  { value: 'media',              ar: 'الإعلام والاتصال',       en: 'Media & Communication' },
  { value: 'other',              ar: 'أخرى',                   en: 'Other' },
];

/** المهارات تقنية بطبيعتها — الاسم نفسه في اللغتين. */
export const SKILLS: BiOption[] = [
  'React', 'Next.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#',
  'Node.js', 'SQL', 'AI', 'Machine Learning', 'Data Analysis', 'Power BI',
  'Cybersecurity', 'Cloud', 'AWS', 'Azure', 'DevOps', 'Flutter', 'Mobile Development',
  'UI/UX', 'Figma', 'Graphic Design', 'Video Editing', 'Photography',
  'Content Creation', 'Marketing', 'Digital Marketing', 'Project Management',
  'Product Management', 'Business Analysis', 'Public Speaking', 'Training',
  'Event Management', 'Translation',
].map((s) => ({ value: s, ar: s, en: s }));

export const PARTICIPATION_MODES: BiOption[] = [
  { value: 'onsite', ar: 'حضوري',   en: 'On-site' },
  { value: 'remote', ar: 'عن بُعد', en: 'Remote' },
  { value: 'both',   ar: 'كلاهما',  en: 'Both' },
];

// ---------- المسار الأول: أبحث عن فرصة ----------

export const CURRENT_STATUSES: BiOption[] = [
  { value: 'university_student', ar: 'طالب جامعي',                 en: 'University student' },
  { value: 'fresh_graduate',     ar: 'حديث تخرج',                  en: 'Fresh graduate' },
  { value: 'employed_seeking',   ar: 'موظف وأبحث عن فرصة أخرى',    en: 'Employed, seeking a new opportunity' },
  { value: 'freelancer',         ar: 'مستقل Freelancer',           en: 'Freelancer' },
  { value: 'business_owner',     ar: 'صاحب مشروع',                 en: 'Business owner' },
];

export const OPPORTUNITY_TYPES: BiOption[] = [
  { value: 'job',                   ar: 'وظيفة',              en: 'Full-time job' },
  { value: 'coop',                  ar: 'تدريب تعاوني',       en: 'Co-op training' },
  { value: 'tamheer',               ar: 'تمهير',              en: 'Tamheer program' },
  { value: 'professional_training', ar: 'تدريب مهني',         en: 'Professional training' },
  { value: 'freelance',             ar: 'عمل حر / مشاريع',    en: 'Freelance / projects' },
  { value: 'other',                 ar: 'أخرى',               en: 'Other' },
];

// ---------- المسار الثاني: خبير / مستشار ----------

export const CONTRIBUTION_TYPES: BiOption[] = [
  { value: 'workshops',  ar: 'تقديم ورش ولقاءات',                  en: 'Workshops & sessions' },
  { value: 'mentoring',  ar: 'الإرشاد Mentoring',                  en: 'Mentoring' },
  { value: 'consulting', ar: 'الاستشارات',                         en: 'Consulting' },
  { value: 'judging',    ar: 'التحكيم وتقييم المشاريع',            en: 'Judging & project evaluation' },
  { value: 'committees', ar: 'المشاركة في لجان أو جلسات تخصصية',   en: 'Committees & expert panels' },
  { value: 'other',      ar: 'أخرى',                               en: 'Other' },
];

// ---------- المسار الثالث: التطوع ----------

export const VOLUNTEER_TYPES: BiOption[] = [
  { value: 'technical',     ar: 'تطوع تخصصي تقني',       en: 'Technical volunteering' },
  { value: 'events',        ar: 'تنظيم وتشغيل فعاليات',  en: 'Event organizing & operations' },
  { value: 'media',         ar: 'إعلام وصناعة محتوى',    en: 'Media & content creation' },
  { value: 'photography',   ar: 'تصوير ومونتاج',         en: 'Photography & video editing' },
  { value: 'design',        ar: 'تصميم',                 en: 'Design' },
  { value: 'partnerships',  ar: 'علاقات وشراكات',        en: 'Partnerships & relations' },
  { value: 'hosting',       ar: 'تقديم وتنسيق لقاءات',   en: 'Hosting & moderating' },
  { value: 'admin_support', ar: 'دعم إداري',             en: 'Administrative support' },
  { value: 'other',         ar: 'أخرى',                  en: 'Other' },
];

export const WEEKLY_HOURS: BiOption[] = [
  { value: '1_3',          ar: '1–3 ساعات',           en: '1–3 hours' },
  { value: '4_6',          ar: '4–6 ساعات',           en: '4–6 hours' },
  { value: '7_10',         ar: '7–10 ساعات',          en: '7–10 hours' },
  { value: 'more_than_10', ar: 'أكثر من 10 ساعات',    en: 'More than 10 hours' },
];

export const AVAILABILITY_TIMES: BiOption[] = [
  { value: 'weekday_morning', ar: 'أيام الأسبوع صباحاً', en: 'Weekday mornings' },
  { value: 'weekday_evening', ar: 'أيام الأسبوع مساءً',  en: 'Weekday evenings' },
  { value: 'weekend',         ar: 'نهاية الأسبوع',       en: 'Weekends' },
  { value: 'flexible',        ar: 'مرن',                 en: 'Flexible' },
];

export const HAS_VOLUNTEERED: BiOption[] = [
  { value: 'true',  ar: 'نعم، سبق لي التطوع', en: 'Yes, I have volunteered before' },
  { value: 'false', ar: 'لا، هذه أول مرة',    en: 'No, this is my first time' },
];
