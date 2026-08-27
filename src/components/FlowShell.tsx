import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';
import { StepIndicator } from '@/components/form/StepIndicator';
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
          className="h-[42px] w-[145px] object-contain object-right sm:h-[52px] sm:w-[205px]"
          onError={() => setLogoError(true)}
        />
      ) : (
        <span className="flex items-center gap-2">
          <Cpu className="h-6 w-6 text-primary" strokeWidth={1.75} />
          <span className="text-base font-bold text-primary">{BRAND.shortAr}</span>
        </span>
      )}
    </Link>
  );
}

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
    <div className="flex min-h-screen flex-col bg-secondary">
      <header className="qt-header">
        <div className="qt-container flex h-16 items-center justify-between sm:h-20">
          <BrandMark />
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            رجوع
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="qt-container flex flex-1 flex-col py-6 sm:py-10">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8">
            <StepIndicator steps={steps} current={current} />
          </div>

          <div className="rounded-panel border border-border bg-white p-5 shadow-soft sm:p-8">
            <h1 className="mb-6 text-xl font-bold text-primary sm:text-2xl">{title}</h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
