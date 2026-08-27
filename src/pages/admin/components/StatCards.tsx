import { Users, CalendarPlus, Star, PhoneCall, type LucideIcon } from 'lucide-react';
import type { SectionStats } from '@/types';
import { cn } from '@/lib/utils';

const CARDS: { key: keyof SectionStats; label: string; icon: LucideIcon; highlight?: boolean }[] = [
  { key: 'total', label: 'إجمالي المسجلين', icon: Users, highlight: true },
  { key: 'thisMonth', label: 'المسجلون هذا الشهر', icon: CalendarPlus },
  { key: 'shortlisted', label: 'المرشحون', icon: Star },
  { key: 'contacted', label: 'من تم التواصل معهم', icon: PhoneCall },
];

/** بطاقات الإحصائيات الأربع أعلى كل قسم من لوحة الإدارة. */
export function StatCards({ stats }: { stats: SectionStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon, highlight }) => (
        <div
          key={key}
          className={cn(
            'qt-lift rounded-card border p-4 sm:p-5',
            highlight ? 'qt-impact-bg border-transparent text-white' : 'border-border bg-white'
          )}
        >
          <div
            className={cn(
              'mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
              highlight ? 'bg-white/15 text-white' : 'bg-accent/10 text-accent'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <p className={cn('text-2xl font-bold', highlight ? 'text-white' : 'text-primary')}>{stats[key]}</p>
          <p className={cn('mt-1 text-xs', highlight ? 'text-white/80' : 'text-muted-foreground')}>{label}</p>
        </div>
      ))}
    </div>
  );
}
