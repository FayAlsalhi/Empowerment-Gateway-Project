import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** زر الإجراء الرئيسي لكل خطوة — ثابت أسفل الشاشة على الجوال بمساحة لمس كبيرة. */
export function SubmitBar({
  label,
  loading,
  disabled,
}: {
  label: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-2 flex justify-end border-t border-border/70 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
      <Button
        type="submit"
        size="lg"
        disabled={disabled || loading}
        className="h-14 w-full gap-2 text-base sm:h-12 sm:w-auto sm:min-w-[10rem]"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </Button>
    </div>
  );
}
