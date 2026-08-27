import { BRAND, CHANNELS, MESSAGES, ORG, SOCIAL_LINKS, WELCOME, type ProfileType } from './config.ts';

const escape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** خط الهوية مع بدائل آمنة لعملاء البريد. */
const FONT = "'IBM Plex Sans Arabic','Cairo',Tahoma,Arial,sans-serif";

/**
 * قالب بريد HTML بهوية جمعية القصيم التقنية.
 * مبني بجداول لأن عملاء البريد (Outlook تحديداً) لا يدعمون flex/grid.
 * الألوان والزوايا منقولة من design-system.md.
 */
export function renderWelcomeEmail(fullName: string, profileType: ProfileType): string {
  const m = MESSAGES[profileType];
  const name = escape((fullName || '').trim().split(/\s+/)[0] || 'صديقنا');

  // عند ضبط ORG_LOGO_URL يظهر الشعار؛ وإن حجبه عميل البريد يظهر النص البديل
  // بنفس التنسيق فلا تبدو الترويسة فارغة أبداً.
  const logo = ORG.logoUrl
    ? `<img src="${escape(ORG.logoUrl)}" alt="${escape(ORG.nameAr)}"
         width="196" height="40"
         style="display:block;border:0;width:196px;height:auto;max-width:70%;
                color:#fff;font:700 17px/40px ${FONT};text-align:center;" />`
    : `<div style="color:#fff;font:700 18px/1.4 ${FONT};">${escape(ORG.nameAr)}</div>`;

  // بطاقتا قنوات واتساب
  const channels = CHANNELS.map(
    (c) => `
      <tr>
        <td style="padding-bottom:10px;">
          <a href="${escape(c.url)}" style="display:block;text-decoration:none;
             background:${BRAND.cyanSoft};border:1px solid ${BRAND.line};
             border-radius:13px;padding:14px 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td width="30" style="font-size:19px;vertical-align:middle;">${c.emoji}</td>
              <td style="vertical-align:middle;">
                <div style="font-size:14px;font-weight:700;color:${BRAND.navy};">${escape(c.title)}</div>
                <div style="font-size:12px;color:${BRAND.muted};margin-top:2px;">${escape(c.desc)}</div>
              </td>
              <td align="left" style="font-size:15px;color:${BRAND.cyan};font-weight:700;
                         vertical-align:middle;white-space:nowrap;">‹</td>
            </tr></table>
          </a>
        </td>
      </tr>`
  ).join('');

  const links = SOCIAL_LINKS.map(
    (l) => `<a href="${escape(l.url)}"
       style="display:inline-block;margin:0 4px;padding:8px 15px;border:1px solid ${BRAND.line};
              border-radius:999px;color:${BRAND.navy};text-decoration:none;
              font-size:12.5px;font-weight:700;">${escape(l.label)}</a>`
  ).join('');

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${escape(ORG.nameAr)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.soft};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(WELCOME.paragraphs[0])}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:${BRAND.soft};padding:28px 12px;">
    <tr><td align="center">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="max-width:560px;background:#fff;border:1px solid ${BRAND.line};
                    border-radius:28px;overflow:hidden;font-family:${FONT};">

        <!-- الترويسة -->
        <tr>
          <td align="center" style="background:${BRAND.navy};padding:26px 24px;" dir="rtl">
            ${logo}
          </td>
        </tr>

        <!-- شريط التمييز السماوي -->
        <tr>
          <td style="background:${BRAND.cyan};height:4px;line-height:4px;font-size:0;">&nbsp;</td>
        </tr>

        <!-- الترحيب -->
        <tr>
          <td style="padding:34px 30px 0;" dir="rtl">

            <span style="display:inline-block;background:${BRAND.cyanSoft};color:${BRAND.navy};
                         border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;">
              <span style="color:${BRAND.cyan};">●</span>&nbsp;${escape(m.badge)}
            </span>

            <h1 style="margin:16px 0 0;font-size:25px;font-weight:700;line-height:1.4;
                       color:${BRAND.navy};">
              يا هلا ${name} 👋
            </h1>

            <p style="margin:14px 0 0;font-size:16px;font-weight:700;line-height:1.6;
                      color:${BRAND.ink};">
              ${escape(WELCOME.heading)}
            </p>

            ${WELCOME.paragraphs
              .map(
                (t) =>
                  `<p style="margin:12px 0 0;font-size:14.5px;line-height:2;color:${BRAND.muted};">${escape(t)}</p>`
              )
              .join('')}

          </td>
        </tr>

        <!-- قنوات واتساب -->
        <tr>
          <td style="padding:26px 30px 4px;" dir="rtl">
            <div style="font-size:14px;font-weight:700;color:${BRAND.ink};margin-bottom:12px;">
              خلّك قريب منّا
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${channels}
            </table>
          </td>
        </tr>


        <!-- روابط + توقيع -->
        <tr>
          <td align="center" style="border-top:1px solid ${BRAND.line};padding:22px 24px 26px;" dir="rtl">
            ${links}
            <div style="margin-top:18px;font-size:13.5px;font-weight:700;color:${BRAND.navy};">
              ${escape(ORG.nameAr)}
            </div>
            <div style="margin-top:3px;font-size:11px;color:${BRAND.muted};letter-spacing:.02em;">
              ${escape(ORG.nameEn)}
            </div>
          </td>
        </tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

/** نسخة نصية بديلة لعملاء البريد التي لا تعرض HTML. */
export function renderWelcomeText(fullName: string, profileType: ProfileType): string {
  const first = (fullName || '').trim().split(/\s+/)[0] || 'صديقنا';
  const channels = CHANNELS.map((c) => `- ${c.title}: ${c.url}`).join('\n');
  return [
    `يا هلا ${first} 👋`,
    '',
    WELCOME.heading,
    '',
    ...WELCOME.paragraphs,
    '',
    'خلّك قريب منّا:',
    channels,
    '',
    ORG.website,
    '',
    '—',
    ORG.nameAr,
  ].join('\n');
}
