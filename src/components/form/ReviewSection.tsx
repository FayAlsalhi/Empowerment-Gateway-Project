import { Pencil } from 'lucide-react';

/** قسم مراجعة يعرض مجموعة قيم في شكل نقاط تفصيلية، مع زر تعديل اختياري. */
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
    <div className="rounded-2xl border border-border bg-secondary/30 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <Pencil className="h-3.5 w-3.5" />
            تعديل
          </button>
        )}
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="truncate text-sm font-medium text-foreground">{item.value || '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
