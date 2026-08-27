import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Cpu } from 'lucide-react';
import { BRAND } from '@/lib/brand';

/** شعار الجمعية مع بديل نصي أنيق عند تعذّر تحميل ملف الشعار. */
function BrandMark() {
  const [logoError, setLogoError] = useState(false);
  return (
    <Link to="/" aria-label={BRAND.nameAr} className="flex items-center">
      {!logoError ? (
        <img
          src={BRAND.logoSrc}
          alt={BRAND.nameAr}
          className="h-[42px] w-[145px] object-contain"
          onError={() => setLogoError(true)}
        />
      ) : (
        <span className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <span className="text-sm font-bold text-primary">{BRAND.shortAr}</span>
        </span>
      )}
    </Link>
  );
}

export default function NotFoundPage() {
  return (
    <div className="qt-hero-bg flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
      <div className="mb-2">
        <BrandMark />
      </div>

      <div className="mb-4 mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
        <Compass className="h-10 w-10 text-accent" strokeWidth={1.75} />
      </div>
      <h1 className="qt-h2 text-primary">404</h1>
      <p className="mt-3 text-lg font-semibold text-primary">هذه الصفحة غير موجودة</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        قد يكون الرابط الذي اتبعته غير صحيح، أو تم نقل الصفحة أو حذفها.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-[50px] items-center justify-center rounded-lg bg-primary px-5 py-[11px] text-base font-bold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
