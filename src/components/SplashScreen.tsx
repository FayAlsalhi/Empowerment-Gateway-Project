import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const FULL_HOLD_MS = 1400;
const REDUCED_HOLD_MS = 500;

/**
 * شاشة بداية قصيرة وهادئة — تُعرض مرة واحدة لكل جلسة تصفح.
 * حركة بسيطة: ظهور الشعار → السطر التحفيزي → اختفاء ثم استدعاء onDone.
 */
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-background px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10"
          >
            <Sparkles className="h-10 w-10 text-primary" strokeWidth={1.75} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.5,
              delay: prefersReducedMotion ? 0.05 : 0.35,
              ease: 'easeOut',
            }}
            className="max-w-xs text-lg font-semibold text-foreground sm:text-xl"
          >
            مكانك بين الفرص يبدأ من هنا.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
