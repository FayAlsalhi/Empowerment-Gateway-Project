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
