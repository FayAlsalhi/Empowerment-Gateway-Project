import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** مؤشر تحميل ملء الصفحة — يُستخدم أثناء التحميل الكسول للصفحات. */
export function PageLoader() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>
    </div>
  );
}

/** هيكل تحميل بديل (skeleton) لصفوف من المحتوى. */
export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex w-full flex-col gap-3" role="status" aria-label="جارٍ التحميل">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-16 w-full animate-pulse rounded-2xl bg-secondary/70',
            i % 2 === 1 && 'w-11/12'
          )}
        />
      ))}
    </div>
  );
}

/** حالة خطأ عامة مع إمكانية إعادة المحاولة. */
export function ErrorState({
  message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <p className="max-w-sm text-sm font-medium text-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
