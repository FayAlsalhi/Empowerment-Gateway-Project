import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** مؤشر خطوات أفقي لمسارات التسجيل — يعرض التقدّم الحالي ضمن الخطوات. */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex w-full items-start" aria-label="خطوات التسجيل">
      {steps.map((step, index) => {
        const isCompleted = index < current;
        const isCurrent = index === current;
        const isLast = index === steps.length - 1;

        return (
          <li key={step} className={cn('flex items-center', !isLast && 'flex-1')}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-300',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary bg-background text-primary',
                  !isCompleted && !isCurrent && 'border-border bg-background text-muted-foreground'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  'hidden max-w-[6.5rem] text-center text-xs font-medium leading-tight sm:block',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300 sm:mb-6',
                  isCompleted ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
