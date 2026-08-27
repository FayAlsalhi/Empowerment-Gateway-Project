import type { ProfileType, TalentRow } from '@/types';
import { VOLUNTEER_TYPE_OPTIONS, labelsFor } from '@/lib/constants';

/** قيمة "الكل" لمرشّحات القائمة المنسدلة (Radix Select يمنع القيمة الفارغة). */
export const ALL_FILTER_VALUE = 'all';

export interface PathConfig {
  profileType: ProfileType;
  tabLabel: string;
  /** اسم القسم يُستخدم كاسم ملف تصدير CSV. */
  sectionName: string;
  emptyMessage: string;
  specialColumnHeader: string;
  renderSpecialColumn: (row: TalentRow) => string;
  /** هل تُعرض فلاتر خاصة بالباحثين عن فرصة (الحالة الحالية، نوع الفرصة، سنوات الخبرة، المسمى المستهدف)؟ */
  showSeekerFilters: boolean;
}

export const PATH_CONFIGS: Record<ProfileType, PathConfig> = {
  opportunity_seeker: {
    profileType: 'opportunity_seeker',
    tabLabel: 'الباحثون عن فرص',
    sectionName: 'الباحثون-عن-فرص',
    emptyMessage: 'لا يوجد باحثون عن فرص مطابقون لبحثك حالياً.',
    specialColumnHeader: 'المسمى المستهدف',
    renderSpecialColumn: (row) => row.target_job_title || '—',
    showSeekerFilters: true,
  },
  expert: {
    profileType: 'expert',
    tabLabel: 'الخبراء والمستشارون',
    sectionName: 'الخبراء-والمستشارون',
    emptyMessage: 'لا يوجد خبراء أو مستشارون مطابقون لبحثك حالياً.',
    specialColumnHeader: 'الجهة الحالية',
    renderSpecialColumn: (row) =>
      [row.current_job_title, row.current_organization].filter(Boolean).join(' — ') || '—',
    showSeekerFilters: false,
  },
  volunteer: {
    profileType: 'volunteer',
    tabLabel: 'المتطوعون',
    sectionName: 'المتطوعون',
    emptyMessage: 'لا يوجد متطوعون مطابقون لبحثك حالياً.',
    specialColumnHeader: 'نوع التطوع',
    renderSpecialColumn: (row) => labelsFor(VOLUNTEER_TYPE_OPTIONS, row.volunteer_type_list),
    showSeekerFilters: false,
  },
};
