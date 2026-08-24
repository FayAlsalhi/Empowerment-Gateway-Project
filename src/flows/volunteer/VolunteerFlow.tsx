import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FlowShell } from '@/components/FlowShell';
import SuccessScreen from '@/components/SuccessScreen';
import { useToast } from '@/components/ui/toast';
import { checkDuplicate, submitProfile, SubmissionError } from '@/lib/submissions';
import type { VolunteerPersonalInfoInput, VolunteerDetailsInput } from '@/schemas';
import type { VolunteerPayload, VolunteerType } from '@/types';
import PersonalInfoStep from './steps/PersonalInfoStep';
import DetailsStep from './steps/DetailsStep';

const STEP_TITLES = ['معلوماتك', 'نوع التطوع ومجالاته'];

interface VolunteerFlowData {
  personal?: VolunteerPersonalInfoInput;
  details?: VolunteerDetailsInput;
}

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

  const handlePersonalNext = useCallback(
    async (values: VolunteerPersonalInfoInput) => {
      const isDuplicate = await checkDuplicate(values.email, values.phone, 'volunteer');
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

  const handleDetailsSubmit = useCallback(
    async (values: VolunteerDetailsInput) => {
      const personal = data.personal;
      if (!personal) return;
      setData((prev) => ({ ...prev, details: values }));
      setSubmitting(true);
      const payload: VolunteerPayload = {
        profile_type: 'volunteer',
        full_name: personal.full_name,
        email: personal.email,
        phone: personal.phone,
        city: personal.city,
        region: personal.region,
        bio: personal.bio || undefined,
        professional_headline: '',
        volunteer_type: values.volunteer_type as VolunteerType,
        interests: values.interests,
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
    },
    [data.personal, toast, goTo]
  );

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
          <motion.div key="personal" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <PersonalInfoStep defaultValues={data.personal} onNext={handlePersonalNext} />
          </motion.div>
        )}
        {current === 1 && (
          <motion.div key="details" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transition}>
            <DetailsStep defaultValues={data.details} onSubmit={handleDetailsSubmit} onBack={handleBack} submitting={submitting} />
          </motion.div>
        )}
      </AnimatePresence>
    </FlowShell>
  );
}
