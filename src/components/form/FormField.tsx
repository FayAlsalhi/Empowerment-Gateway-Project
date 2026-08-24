import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** يلفّ أي عنصر إدخال ويعرض التسمية والتلميح ورسالة الخطأ بالعربية. */
export function FormField({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className={cn('text-sm font-semibold text-foreground', error && 'text-destructive')}>
        {label}
        {required && <span className="text-destructive ms-1">*</span>}
      </Label>
      {hint && <p className="-mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
