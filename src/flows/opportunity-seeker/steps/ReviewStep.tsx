import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewSection } from '@/components/form/ReviewSection';
import {
  SAUDI_REGIONS,
  CURRENT_STATUS_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  SKILLS,
  labelFor,
  labelsFor,
} from '@/lib/constants';
import type { IdentityInput, SeekerDetailsInput, SeekerLinksInput } from '@/schemas';

interface ReviewStepProps {
  identity: IdentityInput;
  details: SeekerDetailsInput;
  links: SeekerLinksInput;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}

/** الخطوة 4: مراجعة نهائية لكل بيانات مسار الباحث عن فرصة قبل الإرسال. */
export default function ReviewStep({ identity, details, links, onEdit, onSubmit, submitting }: ReviewStepProps) {
  const cvExtension = links.cv_path?.split('.').pop()?.toUpperCase() ?? '';

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
          { label: 'نبذة عنك', value: identity.bio },
        ]}
      />

      <ReviewSection
        title="التفاصيل المهنية"
        onEdit={() => onEdit(1)}
        items={[
          { label: 'حالتك الحالية', value: labelFor(CURRENT_STATUS_OPTIONS, details.current_status) },
          { label: 'التخصص', value: details.specialization },
          { label: 'المؤهل العلمي', value: labelFor(EDUCATION_LEVEL_OPTIONS, details.education_level) },
          { label: 'المسمى الوظيفي المستهدف', value: details.target_job_title },
          { label: 'سنوات الخبرة', value: labelFor(YEARS_OF_EXPERIENCE_OPTIONS, details.years_of_experience) },
          { label: 'نوع الفرصة المطلوبة', value: labelsFor(OPPORTUNITY_TYPE_OPTIONS, details.opportunity_preferences) },
          { label: 'المهارات', value: labelsFor(SKILLS, details.skills) },
        ]}
      />

      <ReviewSection
        title="الروابط والملفات"
        onEdit={() => onEdit(2)}
        items={[
          { label: 'السيرة الذاتية', value: cvExtension ? `تم رفع ملف ${cvExtension}` : 'تم رفع الملف' },
          { label: 'LinkedIn', value: links.linkedin_url || '—' },
          { label: 'GitHub', value: links.github_url || '—' },
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
