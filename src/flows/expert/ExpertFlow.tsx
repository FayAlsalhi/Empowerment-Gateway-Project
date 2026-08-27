import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FlowShell } from '@/components/FlowShell';
import SuccessScreen from '@/components/SuccessScreen';
import { useToast } from '@/components/ui/toast';
import { submitProfile, SubmissionError } from '@/lib/submissions';
import type { IdentityInput, ExpertProfessionalInput, ExpertContributionInput, ExpertLinksInput } from '@/schemas';
import type { ExpertPayload, ParticipationMode } from '@/types';
import IdentityStep from './steps/IdentityStep';
import ProfessionalStep from './steps/ProfessionalStep';
import ContributionStep from './steps/ContributionStep';
import LinksStep from './steps/LinksStep';
import ReviewStep from './steps/ReviewStep';

const STEP_TITLES = ['بياناتك', 'البيانات المهنية', 'نوع المساهمة', 'الروابط والملفات', 'مراجعة وإرسال'];

interface ExpertFlowData {
  identity?: IdentityInput;
  professional?: ExpertProfessionalInput;
  contribution?: ExpertContributionInput;
  links?: ExpertLinksInput;
}

/** مسار «أساهم بخبرتي» — حالة واحدة مجمّعة عبر 5 خطوات، لا فقدان للبيانات عند الرجوع. */
export default function ExpertFlow() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<ExpertFlowData>({});
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

  const handleProfessionalNext = useCallback(
    (values: ExpertProfessionalInput) => {
      setData((prev) => ({ ...prev, professional: values }));
      goTo(2, 1);
    },
    [goTo]
  );

  const handleContributionNext = useCallback(
    (values: ExpertContributionInput) => {
      setData((prev) => ({ ...prev, contribution: values }));
      goTo(3, 1);
    },
    [goTo]
  );

  const handleLinksNext = useCallback(
    (values: ExpertLinksInput) => {
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
    if (!data.identity || !data.professional || !data.contribution || !data.links) return;
    setSubmitting(true);
    const payload: ExpertPayload = {
      profile_type: 'expert',
      full_name: data.identity.full_name,
      email: data.identity.email,
      phone: data.identity.phone,
      region: data.identity.region,
      bio: data.identity.bio,
      specialization: data.professional.specialization,
      current_job_title: data.professional.current_job_title,
      current_organization: data.professional.current_organization,
      years_of_experience: data.professional.years_of_experience,
      education_level: data.professional.education_level,
      skills: data.professional.skills,
      contribution_types: data.contribution.contribution_types,
      participation_mode: data.contribution.participation_mode as ParticipationMode,
      cv_path: data.links.cv_path,
      linkedin_url: data.links.linkedin_url,
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
    return <SuccessScreen profileType="expert" />;
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
          <motion.div key="professional" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <ProfessionalStep defaultValues={data.professional} onNext={handleProfessionalNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 2 && (
          <motion.div key="contribution" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <ContributionStep defaultValues={data.contribution} onNext={handleContributionNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 3 && (
          <motion.div key="links" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <LinksStep defaultValues={data.links} onNext={handleLinksNext} onBack={handleBack} />
          </motion.div>
        )}
        {current === 4 && data.identity && data.professional && data.contribution && data.links && (
          <motion.div key="review" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <ReviewStep
              identity={data.identity}
              professional={data.professional}
              contribution={data.contribution}
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
