import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const FULL_HOLD_MS = 1400;
const REDUCED_HOLD_MS = 500;

/**
 * شاشة بداية قصيرة وهادئة — تُعرض مرة واحدة لكل جلسة تصفح.
 * حركة بسيطة: ظهور الشعار → السطر التحفيزي → اختفاء ثم استدعاء onDone.
 */
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const holdMs = prefersReducedMotion ? REDUCED_HOLD_MS : FULL_HOLD_MS;
    const timer = setTimeout(() => setVisible(false), holdMs);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, ease: 'easeInOut' }}
          className="qt-hero-bg fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex h-[58px] w-[230px] items-center justify-center"
          >
            {!logoError ? (
              <img
                src={BRAND.logoSrc}
                alt={BRAND.nameAr}
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Cpu className="h-10 w-10 text-primary" strokeWidth={1.75} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.5,
              delay: prefersReducedMotion ? 0.05 : 0.35,
              ease: 'easeOut',
            }}
            className="flex max-w-xs flex-col items-center gap-1.5"
          >
            <p className="text-lg font-bold text-primary sm:text-xl">{BRAND.nameAr}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{BRAND.tagline}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
