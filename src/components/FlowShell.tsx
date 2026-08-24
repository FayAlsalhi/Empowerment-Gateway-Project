import type { ReactNode } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { StepIndicator } from '@/components/form/StepIndicator';
import { cn } from '@/lib/utils';

/**
 * الغلاف الموحّد لكل مسارات التسجيل: هيدر بسيط بشعار الرجوع، مؤشر الخطوات،
 * وبطاقة المحتوى. مسؤول عن الشكل البصري الموحّد للمسارات الثلاثة.
 */
export function FlowShell({
  steps,
  current,
  title,
  children,
  onBack,
}: {
  steps: string[];
  current: number;
  title: string;
  children: ReactNode;
  onBack: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground sm:text-base">بوابة التمكين</span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            رجوع
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="container flex flex-1 flex-col py-6 sm:py-10">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8">
            <StepIndicator steps={steps} current={current} />
          </div>

          <div
            className={cn(
              'rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.04)] sm:p-8'
            )}
          >
            <h1 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
