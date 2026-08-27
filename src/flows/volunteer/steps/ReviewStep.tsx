import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewSection } from '@/components/form/ReviewSection';
import {
  SAUDI_REGIONS,
  VOLUNTEER_TYPE_OPTIONS,
  SKILLS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  HAS_VOLUNTEERED_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
  AVAILABILITY_TIMES,
  PARTICIPATION_MODE_OPTIONS,
  labelFor,
  labelsFor,
} from '@/lib/constants';
import type { IdentityInput, VolunteerTypeInput, VolunteerDetailsInput, VolunteerLinksInput } from '@/schemas';

interface ReviewStepProps {
  identity: IdentityInput;
  type: VolunteerTypeInput;
  details: VolunteerDetailsInput;
  links: VolunteerLinksInput;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}

/** الخطوة 5: مراجعة نهائية لكل بيانات مسار التطوع قبل الإرسال. */
export default function ReviewStep({ identity, type, details, links, onEdit, onSubmit, submitting }: ReviewStepProps) {
  const cvExtension = links.cv_path ? links.cv_path.split('.').pop()?.toUpperCase() ?? '' : '';

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
        title="نوع التطوع"
        onEdit={() => onEdit(1)}
        items={[{ label: 'أنواع التطوع', value: labelsFor(VOLUNTEER_TYPE_OPTIONS, type.volunteer_types) }]}
      />

      <ReviewSection
        title="تفاصيل المساهمة"
        onEdit={() => onEdit(2)}
        items={[
          { label: 'التخصص', value: details.specialization || '—' },
          { label: 'المهارات', value: labelsFor(SKILLS, details.skills) },
          {
            label: 'سنوات الخبرة في المهارة',
            value: details.years_of_experience ? labelFor(YEARS_OF_EXPERIENCE_OPTIONS, details.years_of_experience) : '—',
          },
          {
            label: 'هل سبق لك التطوع؟',
            value: details.has_volunteered ? labelFor(HAS_VOLUNTEERED_OPTIONS, details.has_volunteered) : '—',
          },
          {
            label: 'الساعات المتاحة أسبوعياً',
            value: details.weekly_hours ? labelFor(WEEKLY_HOURS_OPTIONS, details.weekly_hours) : '—',
          },
          { label: 'أوقات التوفر', value: labelsFor(AVAILABILITY_TIMES, details.availability_times) },
          {
            label: 'طريقة المشاركة',
            value: details.participation_mode ? labelFor(PARTICIPATION_MODE_OPTIONS, details.participation_mode) : '—',
          },
          { label: 'ما تستطيع تقديمه للجمعية', value: details.what_can_offer },
        ]}
      />

      <ReviewSection
        title="الروابط والملفات"
        onEdit={() => onEdit(3)}
        items={[
          { label: 'LinkedIn', value: links.linkedin_url || '—' },
          { label: 'السيرة الذاتية', value: cvExtension ? `تم رفع ملف ${cvExtension}` : '—' },
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
