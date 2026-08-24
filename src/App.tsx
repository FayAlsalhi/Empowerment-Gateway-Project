import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen';
import { PageLoader } from '@/components/common/states';

const HomePage = lazy(() => import('@/pages/HomePage'));
const SeekerFlow = lazy(() => import('@/flows/opportunity-seeker/SeekerFlow'));
const ExpertFlow = lazy(() => import('@/flows/expert/ExpertFlow'));
const VolunteerFlow = lazy(() => import('@/flows/volunteer/VolunteerFlow'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const SPLASH_SEEN_KEY = 'tamkeen_splash_seen';

// التصفح الخاص في Safari يمنع sessionStorage ويرمي استثناءً،
// فنعزله حتى لا يُسقط التطبيق كاملاً.
function safeSessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSessionSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* تجاهل — العرض المتكرر لشاشة البداية أهون من تعطّل الموقع */
  }
}

export default function App() {
  const location = useLocation();
  // تُعرض شاشة البداية مرة واحدة لكل جلسة تصفح
  const [showSplash, setShowSplash] = useState(
    () => safeSessionGet(SPLASH_SEEN_KEY) !== '1'
  );

  useEffect(() => {
    if (!showSplash) safeSessionSet(SPLASH_SEEN_KEY, '1');
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/opportunity-seeker" element={<SeekerFlow />} />
          <Route path="/expert" element={<ExpertFlow />} />
          <Route path="/volunteer" element={<VolunteerFlow />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
