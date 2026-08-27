import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import type { Option } from '@/types';
import {
  SAUDI_REGIONS,
  SPECIALIZATIONS,
  SKILLS,
  CURRENT_STATUS_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  INTERNAL_STATUS_OPTIONS,
} from '@/lib/constants';
import { ALL_FILTER_VALUE } from './pathConfig';

export interface FiltersState {
  search: string;
  region: string;
  specialization: string;
  skills: string[];
  internalStatus: string;
  currentStatus: string;
  opportunityType: string;
  yearsOfExperience: string;
  targetJobTitle: string;
}

export const EMPTY_FILTERS: FiltersState = {
  search: '',
  region: ALL_FILTER_VALUE,
  specialization: '',
  skills: [],
  internalStatus: ALL_FILTER_VALUE,
  currentStatus: ALL_FILTER_VALUE,
  opportunityType: ALL_FILTER_VALUE,
  yearsOfExperience: ALL_FILTER_VALUE,
  targetJobTitle: '',
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>الكل</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** شريط البحث والفلاتر — يختلف عدد الفلاتر بحسب المسار (showSeekerFilters). */
export function FilterBar({
  filters,
  onChange,
  showSeekerFilters,
}: {
  filters: FiltersState;
  onChange: (updater: (prev: FiltersState) => FiltersState) => void;
  showSeekerFilters: boolean;
}) {
  function set<K extends keyof FiltersState>(key: K, value: FiltersState[K]) {
    onChange((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
        <Input
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="ابحث بالاسم أو البريد أو الجوال..."
          className="ps-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <FilterSelect label="المنطقة" value={filters.region} onChange={(v) => set('region', v)} options={SAUDI_REGIONS} />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-muted-foreground">التخصص</span>
          <Input
            value={filters.specialization}
            onChange={(e) => set('specialization', e.target.value)}
            placeholder="اكتب للبحث عن تخصص..."
            list="admin-specializations"
          />
          <datalist id="admin-specializations">
            {SPECIALIZATIONS.map((s) => (
              <option key={s.value} value={s.value} />
            ))}
          </datalist>
        </div>

        <FilterSelect
          label="الحالة الداخلية"
          value={filters.internalStatus}
          onChange={(v) => set('internalStatus', v)}
          options={INTERNAL_STATUS_OPTIONS}
        />

        {showSeekerFilters && (
          <>
            <FilterSelect
              label="الحالة الحالية"
              value={filters.currentStatus}
              onChange={(v) => set('currentStatus', v)}
              options={CURRENT_STATUS_OPTIONS}
            />
            <FilterSelect
              label="نوع الفرصة"
              value={filters.opportunityType}
              onChange={(v) => set('opportunityType', v)}
              options={OPPORTUNITY_TYPE_OPTIONS}
            />
            <FilterSelect
              label="سنوات الخبرة"
              value={filters.yearsOfExperience}
              onChange={(v) => set('yearsOfExperience', v)}
              options={YEARS_OF_EXPERIENCE_OPTIONS}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground">المسمى الوظيفي المستهدف</span>
              <Input
                value={filters.targetJobTitle}
                onChange={(e) => set('targetJobTitle', e.target.value)}
                placeholder="مثال: مطوّر واجهات..."
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-muted-foreground">المهارات</span>
        <MultiSelectChips options={SKILLS} value={filters.skills} onChange={(v) => set('skills', v)} />
      </div>
    </div>
  );
}
