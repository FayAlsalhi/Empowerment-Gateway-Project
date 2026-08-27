import { useState } from 'react';
import { Eye, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { getCvUrl } from '@/lib/admin';
import { INTERNAL_STATUS_OPTIONS, INTERNAL_STATUS_VARIANT, SAUDI_REGIONS, labelFor } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import type { TalentRow } from '@/types';
import type { PathConfig } from './pathConfig';

function SkillsCell({ skills }: { skills: string[] }) {
  if (skills.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const shown = skills.slice(0, 3);
  const rest = skills.length - shown.length;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {shown.map((s) => (
        <span key={s} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
          {s}
        </span>
      ))}
      {rest > 0 && <span className="text-xs font-medium text-muted-foreground">+{rest}</span>}
    </div>
  );
}

function CvButton({ cvPath }: { cvPath: string | null }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleOpen() {
    if (!cvPath) return;
    setLoading(true);
    try {
      const url = await getCvUrl(cvPath);
      window.open(url, '_blank');
    } catch (err) {
      toast({
        title: 'تعذّر فتح السيرة الذاتية',
        description: err instanceof Error ? err.message : undefined,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" className="gap-1.5" disabled={!cvPath || loading} onClick={handleOpen}>
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
      السيرة الذاتية
    </Button>
  );
}

/** جدول متجاوب لعرض صفوف مسار واحد، مع أزرار تفاصيل وسيرة ذاتية لكل صف. */
export function TalentTable({
  rows,
  config,
  onViewDetails,
}: {
  rows: TalentRow[];
  config: PathConfig;
  onViewDetails: (row: TalentRow) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-white shadow-sm">
      <table className="w-full min-w-[960px] text-start text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary text-xs text-muted-foreground">
            <th className="px-4 py-3 text-start font-bold">الاسم</th>
            <th className="px-4 py-3 text-start font-bold">البريد / الجوال</th>
            <th className="px-4 py-3 text-start font-bold">المنطقة</th>
            <th className="px-4 py-3 text-start font-bold">التخصص</th>
            <th className="px-4 py-3 text-start font-bold">{config.specialColumnHeader}</th>
            <th className="px-4 py-3 text-start font-bold">المهارات</th>
            <th className="px-4 py-3 text-start font-bold">الحالة الداخلية</th>
            <th className="px-4 py-3 text-start font-bold">تاريخ التسجيل</th>
            <th className="px-4 py-3 text-start font-bold">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
              <td className="px-4 py-3 font-bold text-primary">{row.full_name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <div className="flex flex-col">
                  <span>{row.email}</span>
                  <span dir="ltr" className="text-xs">
                    {row.phone}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{labelFor(SAUDI_REGIONS, row.region)}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.specialization || '—'}</td>
              <td className="px-4 py-3 text-muted-foreground">{config.renderSpecialColumn(row)}</td>
              <td className="px-4 py-3">
                <SkillsCell skills={row.skills} />
              </td>
              <td className="px-4 py-3">
                <Badge variant={INTERNAL_STATUS_VARIANT[row.internal_status]}>
                  {labelFor(INTERNAL_STATUS_OPTIONS, row.internal_status)}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(row.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:bg-primary/5" onClick={() => onViewDetails(row)}>
                    <Eye className="h-3.5 w-3.5" />
                    عرض التفاصيل
                  </Button>
                  <CvButton cvPath={row.cv_path} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
