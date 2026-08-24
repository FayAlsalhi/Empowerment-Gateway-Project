import { Link } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-4 text-center">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-bold text-foreground">بوابة التمكين</span>
      </div>

      <div className="mb-4 mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Compass className="h-10 w-10 text-primary" strokeWidth={1.75} />
      </div>
      <h1 className="text-6xl font-extrabold text-foreground">404</h1>
      <p className="mt-3 text-lg font-semibold text-foreground">هذه الصفحة غير موجودة</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        قد يكون الرابط الذي اتبعته غير صحيح، أو تم نقل الصفحة أو حذفها.
      </p>
      <Button size="lg" className="mt-8" asChild>
        <Link to="/">العودة للرئيسية</Link>
      </Button>
    </div>
  );
}
