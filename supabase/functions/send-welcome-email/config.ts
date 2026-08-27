/**
 * إعدادات الجمعية وروابط التواصل.
 * كلها قابلة للتعديل عبر متغيّرات البيئة (Supabase Secrets) دون لمس الكود.
 */
const env = (key: string, fallback = ''): string =>
  Deno.env.get(key)?.trim() || fallback;

export const ORG = {
  nameAr: env('ORG_NAME_AR', 'جمعية القصيم التقنية'),
  nameEn: env('ORG_NAME_EN', 'Qassim Tech Association'),
  website: env('ORG_WEBSITE', 'https://qassim.tech'),
  /** ضع رابط الشعار العام هنا ليظهر بدل الحرف البديل */
  logoUrl: env('ORG_LOGO_URL', ''),
} as const;

/** رابط LinkedIn مُرمَّز لأن معرّفه عربي — يعمل في كل عملاء البريد. */
const LINKEDIN_URL =
  'https://www.linkedin.com/in/%D8%AC%D9%85%D8%B9%D9%8A%D8%A9-%D8%A7%D9%84%D9%82%D8%B5%D9%8A%D9%85-%D8%A7%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9-15b77424a';

export const SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: 'الموقع', url: env('LINK_WEBSITE', 'https://qassim.tech') },
  { label: 'X', url: env('LINK_X', 'https://x.com/qassim_tech') },
  { label: 'LinkedIn', url: env('LINK_LINKEDIN', LINKEDIN_URL) },
  { label: 'واتساب', url: env('LINK_WHATSAPP', '') },
].filter((l) => l.url.length > 0);

/**
 * ألوان الهوية — منقولة حرفياً من design-system.md
 * (نفس قيم --navy / --cyan / --ink ... في الموقع الرسمي)
 */
export const BRAND = {
  navy: env('BRAND_PRIMARY', '#201A75'),
  cyan: env('BRAND_ACCENT', '#09B8CB'),
  cyanSoft: '#EAFBFE',
  ink: '#17192D',
  muted: '#6B7186',
  line: '#E7E9F1',
  soft: '#F6F7FB',
  footer: '#0F0D3E',
} as const;

export type ProfileType = 'opportunity_seeker' | 'expert' | 'volunteer';

/** قنوات واتساب — يمكن تغييرها من الأسرار دون لمس الكود. */
export const CHANNELS: { emoji: string; title: string; desc: string; url: string }[] = [
  {
    emoji: '📣',
    title: 'قناة الإعلانات',
    desc: 'كل جديد عن الفعاليات والبرامج',
    url: env('LINK_WA_NEWS', 'https://chat.whatsapp.com/JXMYHm9MepgGTa0URpljsg'),
  },
  {
    emoji: '🤝',
    title: 'قناة المتطوعين',
    desc: 'فرص التطوع أول بأول',
    url: env('LINK_WA_VOLUNTEERS', 'https://chat.whatsapp.com/Fp4WieDwMr3GTpsMnXIJd4'),
  },
].filter((c) => c.url.length > 0);

/** الشارة الصغيرة أعلى الرسالة — تختلف حسب المسار. */
export const MESSAGES: Record<ProfileType, { badge: string }> = {
  opportunity_seeker: { badge: 'مجتمع المواهب' },
  expert: { badge: 'شبكة الخبراء' },
  volunteer: { badge: 'مجتمع المتطوعين' },
};

/** نص الترحيب المشترك لكل المسارات. */
export const WELCOME = {
  heading: 'خطوتك الأولى بدأت ✨',
  paragraphs: [
    'في جمعية القصيم التقنية نؤمن أن الفرص تبدأ من الأشخاص؛ من مهارة تستحق أن تظهر، ' +
      'وخبرة تستحق أن تُشارك، وفكرة يمكن أن تتحول إلى أثر.',
    'بانضمامك، أصبحت جزءًا من مجتمع تقني يجمع الطموح بالخبرة، ويربط الأفكار بالفرص، ' +
      'ويصنع مساحات جديدة للتعلّم والمشاركة والنمو.',
  ],
} as const;
