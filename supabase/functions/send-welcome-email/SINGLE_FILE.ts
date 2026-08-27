// جمعية القصيم التقنية — دالة إرسال بريد الترحيب (ملف واحد)
// الصق كاملاً في: Supabase → Edge Functions → send-welcome-email → Edit

// ============================================================================
// جمعية القصيم التقنية — دالة إرسال بريد الترحيب
//
// تعمل على الخادم (Supabase Edge Function) فقط. تستقبل معرّف الملف، تقرأ
// البيانات بصلاحية الخدمة، ثم ترسل البريد. لا تُمرَّر أي بيانات شخصية من
// المتصفح، ولا توجد أي كلمة مرور داخل الكود — كلها من متغيّرات البيئة.
//
// النشر:  supabase functions deploy send-welcome-email
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const CORS = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

// ============================================================================
// عميل SMTP مكتوب يدوياً — تحكّم كامل ببنية الرسالة.
//
// لماذا لا نستخدم مكتبة جاهزة؟ لأن denomailer تعيد ترميز الترويسات
// (quoted-printable) فوق الترميز الصحيح، فتُفسد صيغة RFC 2047 وتظهر
// الرسالة كشيفرة خام. هنا نكتب كل بايت بأنفسنا.
//
// يدعم وضعَي التشفير:
//   • المنفذ 465 → TLS مباشر           (Gmail)
//   • المنفذ 587 → STARTTLS (ترقية)    (Microsoft 365 / Outlook)
//
// نستخدم base64 لأجزاء النص بدل quoted-printable — لا مشاكل أطوال ولا
// أحرف خاصة ولا حاجة لـ dot-stuffing.
// ============================================================================

const CRLF = '\r\n';
const CLIENT_NAME = 'qassim-portal';

/** ترميز ترويسة عربية وفق RFC 2047 مع طيّ صحيح (كل سطر ≤ 75 حرفاً). */
export function encodeHeader(text: string): string {
  if (!/[-￿]/.test(text)) return text;

  const bytes = new TextEncoder().encode(text);
  const CHUNK = 45; // 45 بايت ⇒ 60 حرف base64 + 12 عبء = 72 < 75
  const parts: string[] = [];

  for (let i = 0; i < bytes.length; ) {
    let end = Math.min(i + CHUNK, bytes.length);
    // لا نقطع حرفاً متعدد البايتات في منتصفه
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    let bin = '';
    for (const b of bytes.subarray(i, end)) bin += String.fromCharCode(b);
    parts.push(`=?UTF-8?B?${btoa(bin)}?=`);
    i = end;
  }
  return parts.join(`${CRLF} `); // مسافة بادئة = طيّ صحيح
}

/** base64 لنص UTF-8، مقسّم على أسطر 76 حرفاً كما يتطلب المعيار. */
function b64Body(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return (btoa(bin).match(/.{1,76}/g) ?? []).join(CRLF);
}

export interface MailOptions {
  hostname: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

class SmtpSession {
  private conn!: Deno.Conn;
  private reader!: ReadableStreamDefaultReader<Uint8Array>;
  private buffer = '';
  private readonly enc = new TextEncoder();
  private readonly dec = new TextDecoder();

  private attachReader(): void {
    this.reader = this.conn.readable.getReader();
    this.buffer = '';
  }

  /**
   * يفتح الجلسة ويصل إلى حالة "جاهز للمصادقة".
   * 465 = TLS مباشر · غير ذلك = STARTTLS
   */
  async open(hostname: string, port: number): Promise<void> {
    if (port === 465) {
      this.conn = await Deno.connectTls({ hostname, port });
      this.attachReader();
      await this.expect(220);
      await this.cmd(`EHLO ${CLIENT_NAME}`, 250);
      return;
    }

    // --- مسار STARTTLS (Microsoft 365 على 587) ---
    this.conn = await Deno.connect({ hostname, port });
    this.attachReader();
    await this.expect(220);
    await this.cmd(`EHLO ${CLIENT_NAME}`, 250);
    await this.cmd('STARTTLS', 220);

    // ترقية الاتصال إلى TLS ثم إعادة التعريف بالعميل
    this.reader.releaseLock();
    this.conn = await Deno.startTls(this.conn as Deno.TcpConn, { hostname });
    this.attachReader();
    await this.cmd(`EHLO ${CLIENT_NAME}`, 250);
  }

  /** يقرأ رداً كاملاً (يتعامل مع الردود متعددة الأسطر مثل 250-...). */
  private async readResponse(): Promise<string> {
    while (true) {
      if (this.buffer.endsWith(CRLF)) {
        const lines = this.buffer.split(CRLF).filter((l) => l.length > 0);
        const last = lines[lines.length - 1];
        // السطر الأخير المكتمل يكون بصيغة "250 نص" (مسافة لا شرطة)
        if (last && /^\d{3} /.test(last)) {
          const out = this.buffer;
          this.buffer = '';
          return out;
        }
      }
      const { value, done } = await this.reader.read();
      if (done) throw new Error('انقطع الاتصال بخادم البريد');
      this.buffer += this.dec.decode(value, { stream: true });
    }
  }

  async expect(code: number): Promise<string> {
    const res = await this.readResponse();
    if (!res.startsWith(String(code))) {
      throw new Error(`خادم البريد رفض العملية (توقعنا ${code}): ${res.trim()}`);
    }
    return res;
  }

  /** يرسل أمراً ولا يسجّل محتواه (حتى لا تظهر كلمة المرور في السجل). */
  async cmd(line: string, expectCode: number): Promise<string> {
    await this.conn.write(this.enc.encode(line + CRLF));
    return await this.expect(expectCode);
  }

  async writeRaw(data: string): Promise<void> {
    await this.conn.write(this.enc.encode(data));
  }

  close(): void {
    try {
      this.reader?.releaseLock();
      this.conn?.close();
    } catch {
      /* الاتصال مغلق أصلاً */
    }
  }
}

/** يبني الرسالة كاملة ويرسلها. يرمي خطأ عربياً عند الفشل. */
export async function sendMail(o: MailOptions): Promise<void> {
  const s = new SmtpSession();

  try {
    await s.open(o.hostname, o.port);

    // AUTH LOGIN: المستخدم ثم كلمة المرور، كلاهما base64
    await s.cmd('AUTH LOGIN', 334);
    await s.cmd(btoa(o.username), 334);
    await s.cmd(btoa(o.password), 235);

    await s.cmd(`MAIL FROM:<${o.fromEmail}>`, 250);
    await s.cmd(`RCPT TO:<${o.to}>`, 250);
    await s.cmd('DATA', 354);

    const boundary = `qt_${crypto.randomUUID().replace(/-/g, '')}`;
    const date = new Date().toUTCString().replace('GMT', '+0000');

    // اسم المُرسِل العربي يُرمَّز، وقد يطول السطر — نطويه بمسافة بادئة
    const encodedFrom = encodeHeader(o.fromName);
    const fromLine =
      `From: ${encodedFrom} <${o.fromEmail}>`.length > 76
        ? `From: ${encodedFrom}${CRLF} <${o.fromEmail}>`
        : `From: ${encodedFrom} <${o.fromEmail}>`;

    // --- الترويسات: تنتهي بسطر فارغ واحد فقط ---
    const headers = [
      fromLine,
      `To: <${o.to}>`,
      `Subject: ${encodeHeader(o.subject)}`,
      `Date: ${date}`,
      `Message-ID: <${crypto.randomUUID()}@qassim.tech>`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ].join(CRLF);

    // --- الجسم: نص بديل ثم HTML، كلاهما base64 ---
    const body = [
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      b64Body(o.text),
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      b64Body(o.html),
      '',
      `--${boundary}--`,
      '',
    ].join(CRLF);

    // نقطة على سطر مستقل تُنهي الرسالة، ثم يرد الخادم بـ 250 عند القبول
    await s.writeRaw(headers + CRLF + body + CRLF + '.' + CRLF);
    await s.expect(250);

    await s.cmd('QUIT', 221).catch(() => {
      /* بعض الخوادم تغلق قبل إرسال الرد */
    });
  } finally {
    s.close();
  }
}

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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const { profile_id } = await req.json();
    if (!profile_id || typeof profile_id !== 'string') {
      return json({ error: 'profile_id مطلوب' }, 400);
    }

    // --- قراءة الملف بصلاحية الخدمة (تتجاوز RLS بأمان داخل الخادم) ---
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, email, profile_type')
      .eq('id', profile_id)
      .single();

    if (error || !profile) return json({ error: 'الملف غير موجود' }, 404);

    // --- إعدادات SMTP من متغيّرات البيئة فقط ---
    // الافتراضي Microsoft 365 (بريد النطاق) — يمكن تغييره من الأسرار
    const host = Deno.env.get('SMTP_HOST') ?? 'smtp.office365.com';
    const port = Number(Deno.env.get('SMTP_PORT') ?? '587');
    const user = Deno.env.get('SMTP_USER');
    const pass = Deno.env.get('SMTP_PASS');
    const from = Deno.env.get('MAIL_FROM') ?? user;

    if (!user || !pass) {
      console.error('SMTP_USER / SMTP_PASS غير مضبوطة — تم تخطي الإرسال.');
      return json({ sent: false, reason: 'smtp_not_configured' }, 200);
    }

    const type = profile.profile_type as ProfileType;

    await sendMail({
      hostname: host,
      port,
      username: user,
      password: pass,
      fromEmail: from!,
      fromName: ORG.nameAr,
      to: profile.email,
      subject: `أهلاً بك في مجتمع ${ORG.nameAr}`,
      text: renderWelcomeText(profile.full_name, type),
      html: renderWelcomeEmail(profile.full_name, type),
    });
    return json({ sent: true });
  } catch (err) {
    // لا نُفشل التسجيل بسبب البريد — نسجّل الخطأ فقط
    console.error('فشل إرسال البريد:', err);
    return json({ sent: false, error: String(err) }, 200);
  }
});
