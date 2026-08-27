import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FlowShell } from '@/components/FlowShell';
import SuccessScreen from '@/components/SuccessScreen';
import { useToast } from '@/components/ui/toast';
import { submitProfile, SubmissionError } from '@/lib/submissions';
import type { IdentityInput, VolunteerTypeInput, VolunteerDetailsInput, VolunteerLinksInput } from '@/schemas';
import type { VolunteerPayload, ParticipationMode } from '@/types';
import IdentityStep from './steps/IdentityStep';
import VolunteerTypeStep from './steps/VolunteerTypeStep';
import DetailsStep from './steps/DetailsStep';
import LinksStep from './steps/LinksStep';
import ReviewStep from './steps/ReviewStep';

const STEP_TITLES = ['بياناتك', 'نوع التطوع', 'تفاصيل المساهمة', 'الروابط والملفات', 'مراجعة وإرسال'];

interface VolunteerFlowData {
  identity?: IdentityInput;
  type?: VolunteerTypeInput;
  details?: VolunteerDetailsInput;
  links?: VolunteerLinksInput;
}

/** مسار «التطوع» — حالة واحدة مجمّعة عبر 5 خطوات، لا فقدان للبيانات عند الرجوع. */
export default function VolunteerFlow() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<VolunteerFlowData>({});
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
    [goTo]
  );

  const handleTypeNext = useCallback(
    (values: VolunteerTypeInput) => {
      setData((prev) => ({ ...prev, type: values }));
      goTo(2, 1);
    },
    [goTo]
  );

  const handleDetailsNext = useCallback(
    (values: VolunteerDetailsInput) => {
      setData((prev) => ({ ...prev, details: values }));
      goTo(3, 1);
    },
    [goTo]
  );

  const handleLinksNext = useCallback(
    (values: VolunteerLinksInput) => {
      setData((prev) => ({ ...prev, links: values }));
      goTo(4, 1);
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
    const { identity, type, details, links } = data;
    if (!identity || !type || !details || !links) return;

    setSubmitting(true);
    const payload: VolunteerPayload = {
      profile_type: 'volunteer',
      full_name: identity.full_name,
      email: identity.email,
      phone: identity.phone,
      region: identity.region,
      bio: identity.bio,
      volunteer_types: type.volunteer_types,
      specialization: details.specialization || undefined,
      skills: details.skills,
      years_of_experience: details.years_of_experience || undefined,
      has_volunteered: details.has_volunteered ? details.has_volunteered === 'true' : undefined,
      weekly_hours: details.weekly_hours || undefined,
      availability_times: details.availability_times,
      participation_mode: (details.participation_mode || undefined) as ParticipationMode | undefined,
      what_can_offer: details.what_can_offer,
      linkedin_url: links.linkedin_url,
      cv_path: links.cv_path || undefined,
      github_url: links.github_url || undefined,
      personal_website_url: links.personal_website_url || undefined,
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
  }, [data, toast]);

  if (submitted) {
    return <SuccessScreen profileType="volunteer" />;
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
          <motion.div key="type" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <VolunteerTypeStep defaultValues={data.type} onNext={handleTypeNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 2 && (
          <motion.div key="details" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <DetailsStep defaultValues={data.details} onNext={handleDetailsNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 3 && (
          <motion.div key="links" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <LinksStep defaultValues={data.links} onNext={handleLinksNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 4 && data.identity && data.type && data.details && data.links && (
          <motion.div key="review" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <ReviewStep
              identity={data.identity}
              type={data.type}
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
