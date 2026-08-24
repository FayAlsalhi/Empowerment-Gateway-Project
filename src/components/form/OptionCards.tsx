import { Check } from 'lucide-react';
import type { Option } from '@/types';
import { cn } from '@/lib/utils';

const COLUMN_CLASSES: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

/** بطاقات اختيار مفرد قابلة للنقر ولوحة المفاتيح (radiogroup). */
export function OptionCards({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div role="radiogroup" className={cn('grid gap-3', COLUMN_CLASSES[columns])}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <div
            key={option.value}
            role="radio"
            aria-checked={selected}
            tabIndex={0}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(option.value);
              }
            }}
            className={cn(
              'relative flex min-h-[3.25rem] cursor-pointer select-none items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3.5 text-sm font-medium transition-all duration-200',
              'hover:border-primary/50 hover:shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              selected
                ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                : 'border-border text-foreground/90'
            )}
          >
            <span>{option.label}</span>
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200',
                selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'
              )}
            >
              {selected && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
          </div>
        );
      })}
    </div>
  );
}
