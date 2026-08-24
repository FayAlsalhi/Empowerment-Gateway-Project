import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FlowShell } from '@/components/FlowShell';
import SuccessScreen from '@/components/SuccessScreen';
import { useToast } from '@/components/ui/toast';
import { checkDuplicate, submitProfile, SubmissionError } from '@/lib/submissions';
import type { PersonalInfoInput, SeekerPreferencesInput, LinksInput } from '@/schemas';
import type { OpportunitySeekerPayload, WorkMode } from '@/types';
import PersonalInfoStep from './steps/PersonalInfoStep';
import PreferencesStep from './steps/PreferencesStep';
import LinksStep from './steps/LinksStep';
import ReviewStep from './steps/ReviewStep';

const STEP_TITLES = ['معلوماتك', 'ما الذي تبحث عنه؟', 'روابطك وملفاتك', 'مراجعة وإرسال'];

interface SeekerFlowData {
  personal?: PersonalInfoInput;
  preferences?: SeekerPreferencesInput;
  links?: LinksInput;
}

export default function SeekerFlow() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<SeekerFlowData>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const goTo = useCallback((step: number, dir: number) => {
    setDirection(dir);
    setCurrent(step);
  }, []);

  const handleBack = useCallback(() => {
    if (current === 0) {
      navigate('/');
      return;
    }
    goTo(current - 1, -1);
  }, [current, navigate, goTo]);

  const handlePersonalNext = useCallback(
    async (values: PersonalInfoInput) => {
      const isDuplicate = await checkDuplicate(values.email, values.phone, 'opportunity_seeker');
      if (isDuplicate) {
        toast({
          title: 'مسجّل مسبقاً',
          description: 'يبدو أنك مسجّل مسبقاً بهذا البريد أو رقم الجوال في هذا المسار.',
          variant: 'error',
        });
        return;
      }
      setData((prev) => ({ ...prev, personal: values }));
      goTo(1, 1);
    },
    [toast, goTo]
  );

  const handlePreferencesNext = useCallback(
    (values: SeekerPreferencesInput) => {
      setData((prev) => ({ ...prev, preferences: values }));
      goTo(2, 1);
    },
    [goTo]
  );

  const handleLinksNext = useCallback(
    (values: LinksInput) => {
      setData((prev) => ({ ...prev, links: values }));
      goTo(3, 1);
    },
    [goTo]
  );

  const handleEdit = useCallback(
    (step: number) => {
      goTo(step, -1);
    },
    [goTo]
  );

  const handleSubmit = useCallback(async () => {
    if (!data.personal || !data.preferences || !data.links) return;
    setSubmitting(true);
    const payload: OpportunitySeekerPayload = {
      profile_type: 'opportunity_seeker',
      ...data.personal,
      current_status: data.preferences.current_status,
      opportunity_preferences: data.preferences.opportunity_preferences,
      preferred_work_mode: data.preferences.preferred_work_mode as WorkMode,
      linkedin_url: data.links.linkedin_url,
      portfolio_url: data.links.portfolio_url,
      personal_website_url: data.links.personal_website_url,
      github_url: data.links.github_url,
      cv_path: data.links.cv_path,
    };
    try {
      await submitProfile(payload);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof SubmissionError) {
        toast({ title: 'تعذّر الإرسال', description: err.message, variant: 'error' });
        if (err.code === 'DUPLICATE') {
          goTo(0, -1);
        }
      } else {
        toast({ title: 'تعذّر الإرسال', description: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.', variant: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  }, [data, toast, goTo]);

  if (submitted) {
    return <SuccessScreen profileType="opportunity_seeker" />;
  }

  const variants = {
    enter: (dir: number) => ({ x: shouldReduceMotion ? 0 : dir > 0 ? 28 : -28, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: shouldReduceMotion ? 0 : dir > 0 ? -28 : 28, opacity: 0 }),
  };
  const transition = { duration: shouldReduceMotion ? 0 : 0.28, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <FlowShell steps={STEP_TITLES} current={current} title={STEP_TITLES[current]} onBack={handleBack}>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {current === 0 && (
          <motion.div key="personal" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <PersonalInfoStep defaultValues={data.personal} onNext={handlePersonalNext} />
          </motion.div>
        )}
        {current === 1 && (
          <motion.div key="preferences" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <PreferencesStep defaultValues={data.preferences} onNext={handlePreferencesNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 2 && (
          <motion.div key="links" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <LinksStep defaultValues={data.links} onNext={handleLinksNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 3 && data.personal && data.preferences && data.links && (
          <motion.div key="review" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <ReviewStep
              personal={data.personal}
              preferences={data.preferences}
              links={data.links}
              onEdit={handleEdit}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </FlowShell>
  );
}
