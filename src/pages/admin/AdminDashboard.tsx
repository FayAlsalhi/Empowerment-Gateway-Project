import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/common/states';
import { BRAND } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { adminSignOut, isAdmin } from '@/lib/admin';
import type { ProfileType } from '@/types';
import { PATH_CONFIGS } from './components/pathConfig';
import { TalentSection } from './components/TalentSection';

const TABS: ProfileType[] = ['opportunity_seeker', 'expert', 'volunteer'];

/** لون النقطة الصغيرة أعلى كل تبويب — نفس ألوان مستويات الباقات في الموقع الرسمي (.qt-levels). */
const TAB_DOT: Record<ProfileType, string> = {
  opportunity_seeker: 'var(--qt-base)',
  expert: 'var(--qt-plus)',
  volunteer: 'var(--qt-pro)',
};

/** لوحة الإدارة — تتحقق من صلاحية المسؤول ثم تعرض تبويبات المسارات الثلاثة. */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileType>('opportunity_seeker');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await isAdmin();
      if (cancelled) return;
      if (!ok) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleSignOut() {
    await adminSignOut();
    navigate('/admin/login', { replace: true });
  }

  if (checking) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background">
      <header className="qt-header">
        <div className="qt-container flex h-20 items-center justify-between qtmd:h-16">
          <div className="flex items-center gap-3">
            {!logoError ? (
              <img
                src={BRAND.logoSrc}
                alt={BRAND.nameAr}
                className="h-[52px] w-[205px] object-contain object-right qtmd:h-[42px] qtmd:w-[145px]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <span className="text-base font-bold text-primary">{BRAND.shortAr}</span>
              </span>
            )}
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              لوحة الإدارة
            </span>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <main className="qt-container flex flex-col gap-6 py-8 qtmd:py-6">
        <div className="flex flex-wrap gap-2 rounded-full border border-border bg-white p-1.5 shadow-sm sm:inline-flex sm:self-start">
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-white text-muted-foreground hover:text-foreground'
                )}
              >
                <i aria-hidden className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: TAB_DOT[tab] }} />
                {PATH_CONFIGS[tab].tabLabel}
              </button>
            );
          })}
        </div>

        <TalentSection key={activeTab} profileType={activeTab} />
      </main>
    </div>
  );
}
