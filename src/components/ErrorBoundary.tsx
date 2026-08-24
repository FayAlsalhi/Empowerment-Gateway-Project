import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

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
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">حدث خطأ غير متوقع</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            نعتذر عن ذلك. يمكنك إعادة تحميل الصفحة والمحاولة مرة أخرى.
          </p>

          <button
            onClick={() => window.location.assign('/')}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RotateCcw className="h-4 w-4" />
            العودة للرئيسية
          </button>

          <details className="mt-5 text-start">
            <summary className="cursor-pointer text-xs text-muted-foreground">
              التفاصيل التقنية
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-muted p-3 text-[11px] leading-relaxed text-muted-foreground">
              {error.message}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
