import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton, ErrorState } from '@/components/common/states';
import { useToast } from '@/components/ui/toast';
import { computeStats, exportCsv, listTalent, updateInternalStatus } from '@/lib/admin';
import type { InternalStatus, ProfileType, TalentFilters, TalentRow } from '@/types';
import { PATH_CONFIGS, ALL_FILTER_VALUE } from './pathConfig';
import { StatCards } from './StatCards';
import { FilterBar, EMPTY_FILTERS } from './FilterBar';
import { TalentTable } from './TalentTable';
import { DetailPanel } from './DetailPanel';
import { useDebounce } from './useDebounce';

/** قسم كامل لمسار واحد: إحصائيات + فلاتر + جدول + لوحة تفاصيل، مرتبط بـ listTalent. */
export function TalentSection({ profileType }: { profileType: ProfileType }) {
  const config = PATH_CONFIGS[profileType];
  const { toast } = useToast();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [rows, setRows] = useState<TalentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<TalentRow | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);
  const debouncedSpecialization = useDebounce(filters.specialization, 400);
  const debouncedTargetJobTitle = useDebounce(filters.targetJobTitle, 400);

  const appliedFilters = useMemo<TalentFilters>(() => {
    const f: TalentFilters = {};
    if (debouncedSearch.trim()) f.search = debouncedSearch.trim();
    if (filters.region !== ALL_FILTER_VALUE) f.region = filters.region;
    if (debouncedSpecialization.trim()) f.specialization = debouncedSpecialization.trim();
    if (filters.skills.length > 0) f.skills = filters.skills;
    if (filters.internalStatus !== ALL_FILTER_VALUE) f.internalStatus = filters.internalStatus as InternalStatus;
    if (config.showSeekerFilters) {
      if (filters.currentStatus !== ALL_FILTER_VALUE) f.currentStatus = filters.currentStatus;
      if (filters.opportunityType !== ALL_FILTER_VALUE) f.opportunityType = filters.opportunityType;
      if (filters.yearsOfExperience !== ALL_FILTER_VALUE) f.yearsOfExperience = filters.yearsOfExperience;
      if (debouncedTargetJobTitle.trim()) f.targetJobTitle = debouncedTargetJobTitle.trim();
    }
    return f;
  }, [
    debouncedSearch,
    filters.region,
    debouncedSpecialization,
    filters.skills,
    filters.internalStatus,
    filters.currentStatus,
    filters.opportunityType,
    filters.yearsOfExperience,
    debouncedTargetJobTitle,
    config.showSeekerFilters,
  ]);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTalent(profileType, appliedFilters);
      setRows(data);
    } catch {
      setError('تعذّر تحميل البيانات. تحقق من الاتصال وحاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, [profileType, appliedFilters]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const stats = useMemo(() => computeStats(rows), [rows]);

  const handleStatusChange = useCallback(
    async (id: string, status: InternalStatus, note?: string) => {
      try {
        await updateInternalStatus(id, status, note);
        setRows((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, internal_status: status, ...(note !== undefined ? { status_note: note } : {}) } : r
          )
        );
        setSelectedRow((prev) =>
          prev && prev.id === id
            ? { ...prev, internal_status: status, ...(note !== undefined ? { status_note: note } : {}) }
            : prev
        );
        toast({ title: 'تم التحديث', description: 'تم تحديث حالة المرشّح بنجاح.', variant: 'success' });
      } catch (err) {
        toast({
          title: 'تعذّر التحديث',
          description: err instanceof Error ? err.message : 'حدث خطأ غير متوقع.',
          variant: 'error',
        });
      }
    },
    [toast]
  );

  const handleExport = useCallback(() => {
    if (rows.length === 0) return;
    exportCsv(rows, config.sectionName);
  }, [rows, config.sectionName]);

  return (
    <div className="flex flex-col gap-5">
      <StatCards stats={stats} />

      <div className="flex flex-col gap-4 rounded-card border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="qt-kicker">تصفية النتائج</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExport}
            disabled={rows.length === 0}
          >
            <Download className="h-4 w-4" />
            تصدير CSV
          </Button>
        </div>
        <FilterBar filters={filters} onChange={setFilters} showSeekerFilters={config.showSeekerFilters} />
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRows} />
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-secondary/50 px-6 py-16 text-center">
          <Inbox className="h-10 w-10 text-accent" />
          <p className="text-sm font-medium text-muted-foreground">{config.emptyMessage}</p>
        </div>
      ) : (
        <TalentTable rows={rows} config={config} onViewDetails={setSelectedRow} />
      )}

      {selectedRow && (
        <DetailPanel
          row={selectedRow}
          config={config}
          onClose={() => setSelectedRow(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
