import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUCCESS_MESSAGES } from '@/lib/constants';
import type { ProfileType } from '@/types';

const PARTICLE_COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))'];

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
    size: 6 + Math.random() * 8,
    color: PARTICLE_COLORS[id % PARTICLE_COLORS.length],
    delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.4,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 80,
  }));
}

/** شاشة نجاح ملء الشاشة مع حركة احتفالية بسيطة، تُعرض بعد إرسال الملف بنجاح. */
export default function SuccessScreen({ profileType }: { profileType: ProfileType }) {
  const navigate = useNavigate();
  const particles = useMemo(() => generateParticles(28), []);
  const { title, message } = SUCCESS_MESSAGES[profileType];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
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
              opacity: [0, 1, 1, 0],
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
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
      >
        <CheckCircle2 className="h-12 w-12 text-primary" strokeWidth={1.75} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 mt-7 max-w-lg text-2xl font-bold text-foreground sm:text-3xl"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32 }}
        className="relative z-10 mt-4 max-w-md text-base leading-relaxed text-muted-foreground"
      >
        {message}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.44 }}
        className="relative z-10 mt-9"
      >
        <Button size="lg" onClick={() => navigate('/')}>
          العودة للرئيسية
        </Button>
      </motion.div>
    </div>
  );
}
