import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FlowShell } from '@/components/FlowShell';
import SuccessScreen from '@/components/SuccessScreen';
import { useToast } from '@/components/ui/toast';
import { checkDuplicate, submitProfile, SubmissionError } from '@/lib/submissions';
import type { DeliveryMode, ExpertPayload } from '@/types';
import type {
  PersonalInfoInput,
  ExpertProfessionalInput,
  ExpertContributionInput,
  LinksInput,
} from '@/schemas';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ProfessionalStep } from './steps/ProfessionalStep';
import { ContributionStep } from './steps/ContributionStep';
import { LinksStep } from './steps/LinksStep';
import { ReviewStep } from './steps/ReviewStep';

const STEPS = ['معلوماتك', 'معلوماتك المهنية', 'كيف ترغب بالمساهمة؟', 'روابطك وملفاتك', 'مراجعة وإرسال'];

const DUPLICATE_MESSAGE = 'يبدو أنك مسجّل مسبقاً بهذا البريد أو رقم الجوال في هذا المسار.';

/** كل الحقول المجمّعة عبر خطوات مسار الخبير — تُبنى تدريجياً وتبقى محفوظة عند التنقل بين الخطوات. */
export type ExpertFormData = Partial<
  PersonalInfoInput & ExpertProfessionalInput & ExpertContributionInput & LinksInput
>;

function buildPayload(data: ExpertFormData): ExpertPayload {
  return {
    profile_type: 'expert',
    full_name: data.full_name ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    city: data.city ?? '',
    region: data.region ?? '',
    bio: data.bio ?? '',
    professional_headline: data.professional_headline ?? '',
    current_job_title: data.current_job_title ?? '',
    current_organization: data.current_organization,
    employment_status: data.employment_status ?? '',
    years_of_experience: data.years_of_experience ?? '',
    education_level: data.education_level ?? '',
    specialization: data.specialization ?? '',
    participation_types: data.participation_types ?? [],
    areas: data.areas ?? [],
    contribution_types: data.contribution_types ?? [],
    target_audiences: data.target_audiences ?? [],
    delivery_mode: (data.delivery_mode ?? 'onsite') as DeliveryMode,
    linkedin_url: data.linkedin_url ?? '',
    portfolio_url: data.portfolio_url,
    personal_website_url: data.personal_website_url,
    github_url: data.github_url,
    cv_path: data.cv_path ?? '',
  };
}

/** مسار تسجيل الخبراء — 5 خطوات مستقلة تُدمج بياناتها تدريجياً قبل الإرسال النهائي. */
export default function ExpertFlow() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<ExpertFormData>({});
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const goToStep = useCallback(
    (step: number) => {
      setDirection(step >= currentStep ? 1 : -1);
      setCurrentStep(step);
    },
    [currentStep]
  );

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      navigate('/');
      return;
    }
    goToStep(currentStep - 1);
  }, [currentStep, goToStep, navigate]);

  const handlePersonalInfoSubmit = useCallback(
    async (data: PersonalInfoInput) => {
      setDuplicateError(null);
      const isDuplicate = await checkDuplicate(data.email, data.phone, 'expert');
      setFormData((prev) => ({ ...prev, ...data }));
      if (isDuplicate) {
        setDuplicateError(DUPLICATE_MESSAGE);
        return;
      }
      goToStep(1);
    },
    [goToStep]
  );

  const handleProfessionalSubmit = useCallback(
    (data: ExpertProfessionalInput) => {
      setFormData((prev) => ({ ...prev, ...data }));
      goToStep(2);
    },
    [goToStep]
  );

  const handleContributionSubmit = useCallback(
    (data: ExpertContributionInput) => {
      setFormData((prev) => ({ ...prev, ...data }));
      goToStep(3);
    },
    [goToStep]
  );

  const handleLinksSubmit = useCallback(
    (data: LinksInput) => {
      setFormData((prev) => ({ ...prev, ...data }));
      goToStep(4);
    },
    [goToStep]
  );

  const handleFinalSubmit = useCallback(async () => {
    setIsSubmittingFinal(true);
    try {
      await submitProfile(buildPayload(formData));
      setSubmitted(true);
    } catch (err) {
      if (err instanceof SubmissionError) {
        toast({ title: err.message, variant: 'error' });
        if (err.code === 'DUPLICATE') {
          setDuplicateError(err.message);
          goToStep(0);
        }
      } else {
        toast({ title: 'تعذّر إرسال بياناتك، يرجى المحاولة مرة أخرى.', variant: 'error' });
      }
    } finally {
      setIsSubmittingFinal(false);
    }
  }, [formData, goToStep, toast]);

  if (submitted) {
    return <SuccessScreen profileType="expert" />;
  }

  const offset = prefersReducedMotion ? 0 : 32;
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? offset : -offset }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -offset : offset }),
  };

  return (
    <FlowShell steps={STEPS} current={currentStep} title="أساهم بخبرتي" onBack={handleBack}>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {currentStep === 0 && (
            <PersonalInfoStep
              defaultValues={formData}
              onSubmit={handlePersonalInfoSubmit}
              duplicateError={duplicateError}
            />
          )}
          {currentStep === 1 && <ProfessionalStep defaultValues={formData} onSubmit={handleProfessionalSubmit} />}
          {currentStep === 2 && <ContributionStep defaultValues={formData} onSubmit={handleContributionSubmit} />}
          {currentStep === 3 && <LinksStep defaultValues={formData} onSubmit={handleLinksSubmit} />}
          {currentStep === 4 && (
            <ReviewStep
              data={formData}
              isSubmitting={isSubmittingFinal}
              onSubmit={handleFinalSubmit}
              onEdit={goToStep}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </FlowShell>
  );
}
