import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewSection } from '@/components/form/ReviewSection';
import {
  SAUDI_REGIONS,
  CONTRIBUTION_TYPES,
  PARTICIPATION_MODE_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  SKILLS,
  labelFor,
  labelsFor,
} from '@/lib/constants';
import type { IdentityInput, ExpertProfessionalInput, ExpertContributionInput, ExpertLinksInput } from '@/schemas';

interface ReviewStepProps {
  identity: IdentityInput;
  professional: ExpertProfessionalInput;
  contribution: ExpertContributionInput;
  links: ExpertLinksInput;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}

/** الخطوة 5: مراجعة نهائية لكل بيانات مسار الخبير/المستشار قبل الإرسال. */
export default function ReviewStep({
  identity,
  professional,
  contribution,
  links,
  onEdit,
  onSubmit,
  submitting,
}: ReviewStepProps) {
  const cvExtension = links.cv_path.split('.').pop()?.toUpperCase() ?? '';

  return (
    <div className="flex flex-col gap-6">
      <ReviewSection
        title="بياناتك"
        onEdit={() => onEdit(0)}
        items={[
          { label: 'الاسم الكامل', value: identity.full_name },
          { label: 'البريد الإلكتروني', value: identity.email },
          { label: 'رقم الجوال', value: identity.phone },
          { label: 'المنطقة', value: labelFor(SAUDI_REGIONS, identity.region) },
          { label: 'نبذة عنك وخبرتك', value: identity.bio },
        ]}
      />

      <ReviewSection
        title="البيانات المهنية"
        onEdit={() => onEdit(1)}
        items={[
          { label: 'التخصص', value: professional.specialization },
          { label: 'المسمى الوظيفي الحالي', value: professional.current_job_title },
          { label: 'جهة العمل الحالية', value: professional.current_organization },
          { label: 'سنوات الخبرة', value: labelFor(YEARS_OF_EXPERIENCE_OPTIONS, professional.years_of_experience) },
          { label: 'المؤهل العلمي', value: labelFor(EDUCATION_LEVEL_OPTIONS, professional.education_level) },
          { label: 'المهارات', value: labelsFor(SKILLS, professional.skills) },
        ]}
      />

      <ReviewSection
        title="نوع المساهمة"
        onEdit={() => onEdit(2)}
        items={[
          { label: 'نوع المساهمة', value: labelsFor(CONTRIBUTION_TYPES, contribution.contribution_types) },
          { label: 'طريقة المشاركة', value: labelFor(PARTICIPATION_MODE_OPTIONS, contribution.participation_mode) },
        ]}
      />

      <ReviewSection
        title="الروابط والملفات"
        onEdit={() => onEdit(3)}
        items={[
          { label: 'السيرة الذاتية', value: cvExtension ? `تم رفع ملف ${cvExtension}` : 'تم رفع الملف' },
          { label: 'LinkedIn', value: links.linkedin_url || '—' },
          { label: 'الموقع الشخصي', value: links.personal_website_url || '—' },
        ]}
      />

      <div className="sticky bottom-0 -mx-4 mt-2 border-t border-border bg-white p-4 shadow-soft sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <Button type="button" size="lg" className="w-full" onClick={onSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="animate-spin" /> جارٍ الإرسال...
            </>
          ) : (
            <>
              إرسال بياناتي <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
