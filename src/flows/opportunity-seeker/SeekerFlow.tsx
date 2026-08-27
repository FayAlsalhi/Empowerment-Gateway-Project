import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FlowShell } from '@/components/FlowShell';
import SuccessScreen from '@/components/SuccessScreen';
import { useToast } from '@/components/ui/toast';
import { submitProfile, SubmissionError } from '@/lib/submissions';
import type { IdentityInput, SeekerDetailsInput, SeekerLinksInput } from '@/schemas';
import type { SeekerPayload } from '@/types';
import IdentityStep from './steps/IdentityStep';
import ProfessionalDetailsStep from './steps/ProfessionalDetailsStep';
import LinksStep from './steps/LinksStep';
import ReviewStep from './steps/ReviewStep';

const STEP_TITLES = ['بياناتك', 'التفاصيل المهنية', 'الروابط والملفات', 'مراجعة وإرسال'];

interface SeekerFlowData {
  identity?: IdentityInput;
  details?: SeekerDetailsInput;
  links?: SeekerLinksInput;
}

/** مسار «أبحث عن فرصة» — حالة واحدة مجمّعة عبر 4 خطوات، لا فقدان للبيانات عند الرجوع. */
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

  const handleIdentityNext = useCallback(
    async (values: IdentityInput) => {
      setData((prev) => ({ ...prev, identity: values }));
      goTo(1, 1);
    },
    [toast, goTo]
  );

  const handleDetailsNext = useCallback(
    (values: SeekerDetailsInput) => {
      setData((prev) => ({ ...prev, details: values }));
      goTo(2, 1);
    },
    [goTo]
  );

  const handleLinksNext = useCallback(
    (values: SeekerLinksInput) => {
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
    if (!data.identity || !data.details || !data.links) return;
    setSubmitting(true);
    const payload: SeekerPayload = {
      profile_type: 'opportunity_seeker',
      full_name: data.identity.full_name,
      email: data.identity.email,
      phone: data.identity.phone,
      region: data.identity.region,
      bio: data.identity.bio,
      current_status: data.details.current_status,
      specialization: data.details.specialization,
      education_level: data.details.education_level,
      target_job_title: data.details.target_job_title,
      years_of_experience: data.details.years_of_experience,
      opportunity_preferences: data.details.opportunity_preferences,
      skills: data.details.skills,
      cv_path: data.links.cv_path,
      linkedin_url: data.links.linkedin_url,
      github_url: data.links.github_url,
      personal_website_url: data.links.personal_website_url,
    };
    try {
      await submitProfile(payload);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof SubmissionError) {
        toast({ title: 'تعذّر الإرسال', description: err.message, variant: 'error' });
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
          <motion.div key="identity" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <IdentityStep defaultValues={data.identity} onNext={handleIdentityNext} />
          </motion.div>
        )}
        {current === 1 && (
          <motion.div key="details" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <ProfessionalDetailsStep defaultValues={data.details} onNext={handleDetailsNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 2 && (
          <motion.div key="links" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <LinksStep defaultValues={data.links} onNext={handleLinksNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 3 && data.identity && data.details && data.links && (
          <motion.div key="review" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <ReviewStep
              identity={data.identity}
              details={data.details}
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
