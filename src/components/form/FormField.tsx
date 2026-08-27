import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * يلفّ أي عنصر إدخال ويعرض التسمية والتلميح ورسالة الخطأ بالعربية.
 *
 * ملاحظة عن المحاذاة: الحقول تُعرض غالباً في شبكة من عمودين، وحقلٌ فيه
 * تلميح («اختياري») كان يدفع مربع إدخاله لأسفل فتبدو الحقول غير مستوية.
 * الحل: رأس الحقل (التسمية + التلميح) بارتفاع ثابت، والإدخال يبدأ عند
 * نفس المستوى في كل الأعمدة.
 */
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
    <div className="flex h-full flex-col">
      {/* رأس الحقل: التسمية على سطر، والتلميح على سطر يبقى محجوزاً دائماً */}
      <div className="flex flex-col gap-0.5">
        <Label className={cn('text-sm font-semibold text-foreground', error && 'text-destructive')}>
          {label}
          {required && <span className="ms-1 text-accent">*</span>}
        </Label>
        <p className="min-h-[16px] text-xs leading-4 text-muted-foreground">{hint ?? ''}</p>
      </div>

      {/* الإدخال يُدفع لأسفل الرأس مباشرة فتتحاذى كل الأعمدة */}
      <div className="mt-1.5">{children}</div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
