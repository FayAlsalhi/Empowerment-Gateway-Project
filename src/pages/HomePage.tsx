import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, GraduationCap, HeartHandshake, ArrowLeft, Cpu,
  UserRound, UserCog, Link2, FileText, Filter, CheckSquare, MessagesSquare,
  type LucideIcon,
} from 'lucide-react';
import { BRAND, SOCIAL_LINKS } from '@/lib/brand';

interface PathCard {
  to: string;
  icon: typeof Briefcase;
  title: string;
  description: string;
  cta: string;
}

const PATH_CARDS: PathCard[] = [
  {
    to: '/opportunity-seeker',
    icon: Briefcase,
    title: 'أبحث عن فرصة',
    description: 'وظيفة، تدريب، وتطوير مهني',
    cta: 'ابدأ ملفك',
  },
  {
    to: '/expert',
    icon: GraduationCap,
    title: 'أساهم بخبرتي',
    description: 'تدريب، إرشاد، واستشارات',
    cta: 'شارك خبرتك',
  },
  {
    to: '/volunteer',
    icon: HeartHandshake,
    title: 'أتطوع',
    description: 'فرص تطوعية تخصصية وتشغيلية',
    cta: 'سجل كمتطوع',
  },
];

const OFFER_CHIPS: { icon: LucideIcon; label: string }[] = [
  { icon: UserRound, label: 'تسجيل الكفاءات والمواهب التقنية' },
  { icon: UserCog, label: 'استقطاب الخبراء والمستشارين' },
  { icon: HeartHandshake, label: 'فرص تطوعية تخصصية وتشغيلية' },
  { icon: Link2, label: 'ربط الباحثين عن فرص بالجهات المناسبة' },
  { icon: FileText, label: 'ملفات تعريفية جاهزة للمراجعة' },
  { icon: Filter, label: 'تصنيف حسب التخصص والمهارة' },
  { icon: CheckSquare, label: 'تسجيل مرن بخطوات واضحة' },
  { icon: MessagesSquare, label: 'قنوات تواصل مباشرة مع الجمعية' },
];

const HOW_STEPS = [
  { n: '01', title: 'اختر مسارك', desc: 'باحث عن فرصة، خبير، أو متطوع.' },
  { n: '02', title: 'أكمل بياناتك', desc: 'خطوات قصيرة وواضحة.' },
  { n: '03', title: 'راجع واعتمد', desc: 'تأكد من بياناتك قبل الإرسال.' },
  { n: '04', title: 'ننتظر التواصل', desc: 'نتواصل معك عند وجود ما يناسبك.' },
];

const BTN_BASE =
  'inline-flex min-h-[45px] items-center justify-center gap-1.5 rounded-lg px-[17px] py-[9px] text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5';
const BTN_LARGE = 'min-h-[50px] px-5 py-[11px] text-base';
const BTN_PRIMARY = 'bg-primary text-primary-foreground';
const BTN_OUTLINE = 'border border-border bg-white text-primary';

/**
 * صورة خلفية القسم الكحلي.
 *
 * تبحث عن أول صورة متاحة في public/images/ وتتحقق أنها صورة فعلية
 * (لا ردّ HTML من الـSPA fallback)، فلا تظهر صور مكسورة إطلاقاً.
 * إن لم توجد صورة يبقى النمط الزخرفي وحده.
 */
function BackdropPhoto() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const candidates = ['jpg', 'jpeg', 'webp', 'png'].map((ext) => `/images/bg-1.${ext}`);

    (async () => {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          const type = res.headers.get('content-type') ?? '';
          if (res.ok && type.startsWith('image/')) {
            if (alive) setSrc(url);
            return;
          }
        } catch {
          /* تجاهل وجرّب الامتداد التالي */
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (!src) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />

      {/* حجاب الهوية: كحلي غامق مع لمسة زرقاء فاتحة — يبقي النص واضحاً */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(32,26,117,.78) 0%, rgba(40,34,130,.70) 45%, rgba(20,16,78,.80) 100%)',
        }}
      />
      {/* توهّج سماوي خفيف بلون --cyan */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 78% 18%, rgba(9,184,203,.14), transparent 62%)',
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="qt-header">
        <div className="qt-container flex h-20 items-center justify-between qtmd:h-16">
          <Link to="/" aria-label={BRAND.nameAr} className="flex items-center">
            {!logoError ? (
              <img
                src={BRAND.logoSrc}
                alt={BRAND.nameAr}
                className="h-[52px] w-[205px] object-contain object-right qtmd:h-[42px] qtmd:w-[145px]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <span className="text-base font-bold text-primary">{BRAND.shortAr}</span>
              </span>
            )}
          </Link>

          <a href="#paths" className={`${BTN_BASE} ${BTN_PRIMARY} hidden sm:inline-flex`}>
            سجّل الآن
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="qt-hero-bg">
          <div className="qt-container grid grid-cols-2 items-center gap-[70px] py-[75px] qtlg:grid-cols-1 qtlg:gap-10 qtlg:py-12 qtmd:py-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="qt-badge">
                <i /> بوابة تسجيل موحّدة
              </span>
              <h1 className="qt-h1 mt-4 text-primary">
                نُمكّن <span className="text-accent">طموحك</span> لنَبني القادم
              </h1>
              <p className="mt-5 max-w-lg text-[1.08rem] leading-relaxed text-muted-foreground">
                {BRAND.tagline}. سجّل بياناتك في دقائق، وانضم إلى مجتمع الكفاءات والخبراء والمتطوعين.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#paths" className={`${BTN_BASE} ${BTN_LARGE} ${BTN_PRIMARY}`}>
                  ابدأ التسجيل ←
                </a>
                <a href="#how" className={`${BTN_BASE} ${BTN_LARGE} ${BTN_OUTLINE}`}>
                  كيف تعمل البوابة؟
                </a>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">التسجيل مجاني ويستغرق دقائق قليلة فقط.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="rounded-panel border border-border bg-white p-7 shadow-showcase qtlg:mx-auto qtlg:w-full qtlg:max-w-md"
            >
              {!logoError ? (
                <img
                  src={BRAND.logoSrc}
                  alt={BRAND.nameAr}
                  className="mx-auto mb-6 h-[58px] w-[230px] object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="mb-6 flex items-center justify-center gap-2">
                  <Cpu className="h-8 w-8 text-primary" strokeWidth={1.75} />
                  <span className="text-lg font-bold text-primary">{BRAND.shortAr}</span>
                </div>
              )}

              <div className="qt-impact-bg rounded-card p-5 text-white">
                <strong className="block text-base font-bold">من التسجيل… إلى فرصة حقيقية</strong>
                <span className="mt-1 block text-sm text-white/80">نستلم بياناتك، نراجعها، ثم نتواصل معك.</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {['نسجّل', 'نراجع', 'نربط'].map((word) => (
                  <span
                    key={word}
                    className="rounded-lg border border-border bg-secondary px-2 py-3 text-center text-sm font-semibold text-foreground"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="paths" className="bg-white py-[82px] qtmd:py-[54px]">
          <div className="qt-container">
            <div className="mb-9 grid items-end gap-8 qtlg:grid-cols-1" style={{ gridTemplateColumns: '1fr 0.85fr' }}>
              <div>
                <p className="qt-kicker">اختر نقطة البداية</p>
                <h2 className="qt-h2 text-primary">كيف تريد الانضمام إلينا؟</h2>
              </div>
              <p className="justify-self-end text-muted-foreground qtlg:justify-self-start" style={{ maxWidth: 520 }}>
                اختر المسار الأنسب لك، وسجّل بياناتك في خطوات بسيطة وواضحة.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-[17px] qtlg:grid-cols-1">
              {PATH_CARDS.map((card, index) => (
                <motion.div
                  key={card.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
                >
                  <Link
                    to={card.to}
                    className="qt-lift group relative flex min-h-[225px] flex-col justify-between overflow-hidden rounded-card border border-border bg-white p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="relative flex flex-col gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                        <card.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary">{card.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                      </div>
                    </div>

                    <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      {card.cta}
                      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="qt-navy-bg relative overflow-hidden">
          <BackdropPhoto />
          {/* نمط زخرفي: شبكة نقاط خافتة + توهّج سماوي — بألوان الهوية */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,.20) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              maskImage:
                'radial-gradient(120% 90% at 80% 20%, #000 30%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(120% 90% at 80% 20%, #000 30%, transparent 75%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 start-[-10%] h-[420px] w-[420px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(9,184,203,.30), transparent 65%)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 end-[-8%] h-[380px] w-[380px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(9,184,203,.16), transparent 65%)' }}
          />

          <div
            className="qt-container relative grid items-center gap-12 py-[82px] qtlg:grid-cols-1 qtlg:gap-9 qtlg:py-14 qtmd:py-11"
            style={{ gridTemplateColumns: '0.9fr 1.1fr' }}
          >
            {/* العنوان */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-[0.8rem] font-bold text-accent">منصة تسجيل متكاملة</span>
              </span>

              <h2 className="qt-h2 mt-4 text-white">
                ليس كل انضمام
                <br />
                يحتاج تعقيدًا.
              </h2>

              <p className="mt-4 max-w-md text-[1.02rem] leading-[2] text-white/70">
                نجمع تسجيل المواهب والخبراء والمتطوعين في مسار واحد بسيط وواضح.
              </p>

              <div className="mt-7 h-px w-24 bg-gradient-to-l from-accent to-transparent" />
            </div>

            {/* شبكة المزايا */}
            <div className="grid grid-cols-2 gap-3 qtmd:grid-cols-1">
              {OFFER_CHIPS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="group flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.06] p-3.5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/[0.10]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent/25">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[0.9rem] font-semibold leading-[1.6] text-white/90">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="bg-secondary py-[82px] qtmd:py-[54px]">
          <div className="qt-container">
            <div className="mb-9">
              <p className="qt-kicker">خطوات بسيطة</p>
              <h2 className="qt-h2 text-primary">كيف تعمل البوابة؟</h2>
            </div>

            <div className="grid grid-cols-4 gap-4 qtlg:grid-cols-2 qtmd:grid-cols-1">
              {HOW_STEPS.map((step) => (
                <div key={step.n} className="rounded-card border border-border bg-white p-5">
                  <span className="text-sm font-bold text-accent">{step.n}</span>
                  <h3 className="mt-2 font-bold text-primary">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: 'var(--qt-footer)' }} className="py-8 text-white">
        <div className="qt-container flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {!logoError ? (
              <img
                src={BRAND.logoSrc}
                alt={BRAND.nameAr}
                className="h-[48px] w-[185px] object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-white" strokeWidth={1.75} />
                <span className="text-base font-bold text-white">{BRAND.shortAr}</span>
              </span>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              {SOCIAL_LINKS.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/60">
            <span>© {BRAND.nameAr}</span>
            <span>منصة تسجيل مبسّطة تربط الكفاءات بالفرص</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
