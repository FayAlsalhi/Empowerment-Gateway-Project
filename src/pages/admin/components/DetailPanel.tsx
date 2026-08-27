import { useState } from 'react';
import { X, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReviewSection } from '@/components/form/ReviewSection';
import { useToast } from '@/components/ui/toast';
import { getCvUrl } from '@/lib/admin';
import {
  SAUDI_REGIONS,
  SPECIALIZATIONS,
  EDUCATION_LEVEL_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  CURRENT_STATUS_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  CONTRIBUTION_TYPES,
  PARTICIPATION_MODE_OPTIONS,
  VOLUNTEER_TYPE_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
  AVAILABILITY_TIMES,
  HAS_VOLUNTEERED_OPTIONS,
  INTERNAL_STATUS_OPTIONS,
  labelFor,
  labelsFor,
} from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import type { InternalStatus, TalentRow } from '@/types';
import type { PathConfig } from './pathConfig';

/** لوحة/بطاقة جانبية بكل بيانات الشخص — تصبح ملء الشاشة على الجوال. */
export function DetailPanel({
  row,
  config,
  onClose,
  onStatusChange,
}: {
  row: TalentRow;
  config: PathConfig;
  onClose: () => void;
  onStatusChange: (id: string, status: InternalStatus, note?: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const [note, setNote] = useState(row.status_note ?? '');
  const [savingNote, setSavingNote] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);

  async function handleOpenCv() {
    if (!row.cv_path) return;
    setCvLoading(true);
    try {
      const url = await getCvUrl(row.cv_path);
      window.open(url, '_blank');
    } catch (err) {
      toast({
        title: 'تعذّر فتح السيرة الذاتية',
        description: err instanceof Error ? err.message : undefined,
        variant: 'error',
      });
    } finally {
      setCvLoading(false);
    }
  }

  async function handleSaveNote() {
    setSavingNote(true);
    await onStatusChange(row.id, row.internal_status, note);
    setSavingNote(false);
  }

  const identityItems = [
    { label: 'الاسم الكامل', value: row.full_name },
    { label: 'البريد الإلكتروني', value: row.email },
    { label: 'الجوال', value: row.phone },
    { label: 'المنطقة', value: labelFor(SAUDI_REGIONS, row.region) },
    { label: 'تاريخ التسجيل', value: formatDate(row.created_at) },
  ];

  const professionalItems: { label: string; value: string }[] = [
    { label: 'التخصص', value: row.specialization ? labelFor(SPECIALIZATIONS, row.specialization) : '—' },
    { label: 'المؤهل العلمي', value: row.education_level ? labelFor(EDUCATION_LEVEL_OPTIONS, row.education_level) : '—' },
    {
      label: 'سنوات الخبرة',
      value: row.years_of_experience ? labelFor(YEARS_OF_EXPERIENCE_OPTIONS, row.years_of_experience) : '—',
    },
    { label: 'المهارات', value: row.skills.length > 0 ? row.skills.join(' · ') : '—' },
  ];

  if (config.profileType === 'opportunity_seeker') {
    professionalItems.push(
      { label: 'الحالة الحالية', value: row.current_status ? labelFor(CURRENT_STATUS_OPTIONS, row.current_status) : '—' },
      { label: 'المسمى الوظيفي المستهدف', value: row.target_job_title || '—' },
      { label: 'نوع الفرصة المطلوبة', value: labelsFor(OPPORTUNITY_TYPE_OPTIONS, row.opportunity_types) }
    );
  }
  if (config.profileType === 'expert') {
    professionalItems.push(
      { label: 'المسمى الوظيفي الحالي', value: row.current_job_title || '—' },
      { label: 'جهة العمل الحالية', value: row.current_organization || '—' },
      { label: 'نوع المساهمة', value: labelsFor(CONTRIBUTION_TYPES, row.contribution_types) },
      {
        label: 'طريقة المشاركة',
        value: row.participation_mode ? labelFor(PARTICIPATION_MODE_OPTIONS, row.participation_mode) : '—',
      },
      { label: 'نبذة مختصرة', value: row.bio || '—' }
    );
  }
  if (config.profileType === 'volunteer') {
    professionalItems.push(
      { label: 'نوع التطوع', value: labelsFor(VOLUNTEER_TYPE_OPTIONS, row.volunteer_type_list) },
      {
        label: 'هل سبق التطوع؟',
        value: row.has_volunteered === null ? '—' : labelFor(HAS_VOLUNTEERED_OPTIONS, String(row.has_volunteered)),
      },
      { label: 'الساعات المتاحة أسبوعياً', value: row.weekly_hours ? labelFor(WEEKLY_HOURS_OPTIONS, row.weekly_hours) : '—' },
      { label: 'أوقات التوفر', value: labelsFor(AVAILABILITY_TIMES, row.availability_times) },
      {
        label: 'طريقة المشاركة',
        value: row.participation_mode ? labelFor(PARTICIPATION_MODE_OPTIONS, row.participation_mode) : '—',
      },
      { label: 'ما الذي يستطيع تقديمه', value: row.what_can_offer || '—' }
    );
  }

  const links = [
    { label: 'LinkedIn', url: row.linkedin_url },
    { label: 'GitHub', url: row.github_url },
    { label: 'الموقع الشخصي', url: row.personal_website_url },
  ].filter((l): l is { label: string; url: string } => Boolean(l.url));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
      />
      <div className="relative flex h-full w-full flex-col overflow-y-auto border-s border-border bg-background shadow-2xl qtmd:w-full sm:w-[480px]">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground">
          <div>
            <h2 className="text-base font-bold">{row.full_name}</h2>
            <p className="text-xs text-white/70">{config.tabLabel}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="إغلاق"
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <ReviewSection title="البيانات الأساسية" items={identityItems} />
          <ReviewSection title="البيانات المهنية" items={professionalItems} />

          {links.length > 0 && (
            <div className="rounded-card border border-border bg-secondary/50 p-5">
              <h3 className="mb-3 text-sm font-bold text-primary">الروابط</h3>
              <div className="flex flex-wrap gap-2">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-accent" />
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-card border border-border bg-secondary/50 p-5">
            <h3 className="mb-3 text-sm font-bold text-primary">السيرة الذاتية</h3>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!row.cv_path || cvLoading}
              onClick={handleOpenCv}
            >
              {cvLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {row.cv_path ? 'فتح السيرة الذاتية' : 'لا توجد سيرة ذاتية مرفقة'}
            </Button>
          </div>

          <div className="flex flex-col gap-3 rounded-card border border-border bg-secondary/50 p-5">
            <h3 className="text-sm font-bold text-primary">الحالة الداخلية</h3>
            <Select value={row.internal_status} onValueChange={(v) => onStatusChange(row.id, v as InternalStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERNAL_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="text-xs font-bold text-muted-foreground">ملاحظة داخلية</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أضف ملاحظة داخلية حول هذا المرشّح..."
              rows={3}
            />
            <Button size="sm" onClick={handleSaveNote} disabled={savingNote} className="self-start gap-2">
              {savingNote && <Loader2 className="h-4 w-4 animate-spin" />}
              حفظ الملاحظة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
