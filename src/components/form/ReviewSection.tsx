import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

/** قسم مراجعة يعرض مجموعة قيم في صفوف مفصولة، مع زر تعديل اختياري. */
export function ReviewSection({
  title,
  items,
  onEdit,
}: {
  title: string;
  items: { label: string; value: string }[];
  onEdit?: () => void;
}) {
  return (
    <div className="rounded-card border border-border bg-white p-5 sm:p-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="qt-kicker">{title}</h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            <Pencil className="h-3.5 w-3.5" />
            تعديل
          </button>
        )}
      </div>
      <dl className="flex flex-col">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6',
              index !== 0 && 'border-t border-border'
            )}
          >
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="text-sm font-medium text-foreground sm:text-end">{item.value || '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
