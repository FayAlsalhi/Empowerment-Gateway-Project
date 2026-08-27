/**
 * هوية جمعية القصيم التقنية.
 *
 * الألوان والزوايا والظلال معرّفة في `src/index.css` نقلاً عن
 * design-system.md المستخرج من الموقع الرسمي. لا تكتب ألواناً ثابتة
 * في المكوّنات — استخدم أصناف Tailwind المرتبطة بتلك المتغيّرات.
 */
export const BRAND = {
  nameAr: 'جمعية القصيم التقنية',
  nameEn: 'Qassim Tech Association',
  shortAr: 'القصيم التقنية',
  tagline: 'نُمكّن المواهب التقنية ونربطها بالفرص',
  website: 'https://qassim.tech',
  /** الشعار الرسمي — نفس الملف يُستخدم في الهيدر والهيرو والفوتر */
  logoSrc: '/logo.webp',
} as const;

/** ألوان الهوية كقيم صريحة، للحالات التي تحتاج اللون داخل JS (SVG، تدرّج). */
export const COLORS = {
  navy: '#201A75',
  navy2: '#14104E',
  cyan: '#09B8CB',
  cyanSoft: '#EAFBFE',
  ink: '#17192D',
  muted: '#6B7186',
  line: '#E7E9F1',
  soft: '#F6F7FB',
  kicker: '#087F90',
  footer: '#0F0D3E',
} as const;

/**
 * روابط التواصل الرسمية.
 * رابط LinkedIn مُرمَّز (percent-encoded) لأن معرّفه عربي —
 * يعمل في كل المتصفحات وداخل رسائل البريد.
 */
export const SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: 'الموقع الرسمي', url: 'https://qassim.tech' },
  { label: 'خدماتنا', url: 'https://qassim.tech/services/' },
  { label: 'X', url: 'https://x.com/qassim_tech' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/%D8%AC%D9%85%D8%B9%D9%8A%D8%A9-%D8%A7%D9%84%D9%82%D8%B5%D9%8A%D9%85-%D8%A7%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9-15b77424a',
  },
];
