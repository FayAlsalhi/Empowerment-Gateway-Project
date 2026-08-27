import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { BRAND } from '@/lib/brand';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * يمنع الشاشة البيضاء: أي خطأ غير متوقع في الشجرة يُعرض كرسالة مفهومة
 * بدلاً من انهيار صامت.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // يظهر في Console المتصفح وفي سجلات المنصة
    // eslint-disable-next-line no-console
    console.error('[بوابة التمكين] خطأ غير متوقع:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="qt-hero-bg flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-panel border border-border bg-white p-8 text-center shadow-showcase">
          <p className="mb-5 text-xs font-semibold text-muted-foreground">{BRAND.shortAr}</p>

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-primary">حدث خطأ غير متوقع</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            نعتذر عن ذلك. يمكنك إعادة تحميل الصفحة والمحاولة مرة أخرى.
          </p>

          <button
            onClick={() => window.location.assign('/')}
            className="mt-6 inline-flex min-h-[45px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
          >
            <RotateCcw className="h-4 w-4" />
            العودة للرئيسية
          </button>

          <details className="mt-5 text-start">
            <summary className="cursor-pointer text-xs text-muted-foreground">
              التفاصيل التقنية
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-secondary p-3 text-[11px] leading-relaxed text-muted-foreground">
              {error.message}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
