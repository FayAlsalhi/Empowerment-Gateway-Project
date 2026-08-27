import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Cpu } from 'lucide-react';
import { SUCCESS_MESSAGES } from '@/lib/constants';
import { BRAND } from '@/lib/brand';
import type { ProfileType } from '@/types';

const PARTICLE_COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))'];

interface Particle {
  id: number;
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotate: number;
  drift: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 5 + Math.random() * 6,
    color: PARTICLE_COLORS[id % PARTICLE_COLORS.length],
    delay: Math.random() * 0.5,
    duration: 1.8 + Math.random() * 1.1,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 60,
  }));
}

/** شعار الجمعية مع بديل نصي أنيق عند تعذّر تحميل ملف الشعار. */
function BrandMark() {
  const [logoError, setLogoError] = useState(false);
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
      {!logoError ? (
        <img
          src={BRAND.logoSrc}
          alt={BRAND.nameAr}
          className="h-full w-full object-contain p-1"
          onError={() => setLogoError(true)}
        />
      ) : (
        <Cpu className="h-4 w-4 text-primary" strokeWidth={1.75} />
      )}
    </div>
  );
}

/** بطاقة نجاح أنيقة وهادئة، تُعرض بعد إرسال الملف بنجاح. */
export default function SuccessScreen({ profileType }: { profileType: ProfileType }) {
  const navigate = useNavigate();
  const particles = useMemo(() => generateParticles(16), []);
  const { title, message } = SUCCESS_MESSAGES[profileType];

  return (
    <div className="qt-hero-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.4,
              backgroundColor: p.color,
            }}
            initial={{ y: -40, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: '110vh',
              x: p.drift,
              opacity: [0, 0.8, 0.8, 0],
              rotate: p.rotate,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-md flex-col items-center rounded-panel border border-border bg-white px-7 py-10 text-center shadow-showcase sm:px-10"
      >
        <div className="mb-5 flex items-center gap-2">
          <BrandMark />
          <span className="text-xs font-semibold text-muted-foreground">{BRAND.shortAr}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10"
        >
          <CheckCircle2 className="h-8 w-8 text-accent" strokeWidth={1.75} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-6 text-xl font-bold text-primary sm:text-2xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-8 w-full"
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex min-h-[50px] w-full items-center justify-center rounded-lg bg-primary px-5 py-[11px] text-base font-bold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
          >
            العودة للرئيسية
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
