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
              'qt-lift relative flex min-h-[3.25rem] cursor-pointer select-none items-center justify-between gap-3 rounded-card border bg-white px-4 py-3.5 text-sm font-semibold',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              selected
                ? 'border-primary bg-accent/10 text-foreground'
                : 'border-border text-foreground/90 hover:border-primary/30'
            )}
          >
            <span>{option.label}</span>
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200',
                selected ? 'border-accent bg-accent text-white' : 'border-border bg-white'
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
