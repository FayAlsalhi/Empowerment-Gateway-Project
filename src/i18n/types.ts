/** اللغات المدعومة. */
export type Lang = 'ar' | 'en';

/** خيار ثنائي اللغة: القيمة مفتاح ثابت يُخزَّن، والتسميتان للعرض فقط. */
export interface BiOption {
  value: string;
  ar: string;
  en: string;
}

/** يحوّل قائمة ثنائية اللغة إلى خيارات جاهزة للعرض بلغة معيّنة. */
export function localize(options: BiOption[], lang: Lang): { value: string; label: string }[] {
  return options.map((o) => ({ value: o.value, label: lang === 'ar' ? o.ar : o.en }));
}

/** التسمية المقابلة لقيمة مخزّنة. */
export function labelOf(options: BiOption[], value: string, lang: Lang): string {
  const found = options.find((o) => o.value === value);
  if (!found) return value; // قيمة مكتوبة يدوياً (خيار «أخرى»)
  return lang === 'ar' ? found.ar : found.en;
}

/** تسميات متعددة مفصولة. */
export function labelsOf(
  options: BiOption[],
  values: string[] | null | undefined,
  lang: Lang
): string {
  if (!values || values.length === 0) return '—';
  return values.map((v) => labelOf(options, v, lang)).join(' · ');
}
