import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, HeartHandshake, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground sm:text-base">بوابة التمكين</span>
        </div>
      </header>

      <main className="container flex flex-1 flex-col justify-center py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
        >
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            فرصتك تبدأ من هنا
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            اختر الطريقة التي ترغب أن تبدأ بها رحلتك في بوابة التمكين.
          </p>
        </motion.div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PATH_CARDS.map((card, index) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
            >
              <Link
                to={card.to}
                className={cn(
                  'group flex h-full flex-col justify-between gap-8 rounded-2xl border border-border bg-card p-7 shadow-sm',
                  'transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                    <card.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-lg font-bold text-foreground">{card.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {card.cta}
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="container flex flex-col items-center gap-1 py-8 text-center">
        <p className="text-xs text-muted-foreground">بوابة التمكين — منصة تسجيل مبسّطة تربط الكفاءات بالفرص</p>
      </footer>
    </div>
  );
}
