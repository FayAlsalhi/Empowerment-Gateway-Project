import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewSection } from '@/components/form/ReviewSection';
import {
  CURRENT_STATUS_OPTIONS,
  OPPORTUNITY_PREFERENCES,
  WORK_MODE_OPTIONS,
  labelFor,
} from '@/lib/constants';
import type { PersonalInfoInput, SeekerPreferencesInput, LinksInput } from '@/schemas';

interface ReviewStepProps {
  personal: PersonalInfoInput;
  preferences: SeekerPreferencesInput;
  links: LinksInput;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function ReviewStep({ personal, preferences, links, onEdit, onSubmit, submitting }: ReviewStepProps) {
  const cvExtension = links.cv_path.split('.').pop()?.toUpperCase() ?? '';

  return (
    <div className="flex flex-col gap-6">
      <ReviewSection
        title="المعلومات الشخصية"
        onEdit={() => onEdit(0)}
        items={[
          { label: 'الاسم الكامل', value: personal.full_name },
          { label: 'البريد الإلكتروني', value: personal.email },
          { label: 'رقم الجوال', value: personal.phone },
          { label: 'المدينة', value: personal.city },
          { label: 'المنطقة', value: personal.region },
          { label: 'العنوان المهني', value: personal.professional_headline },
          { label: 'نبذة عنك', value: personal.bio },
        ]}
      />

      <ReviewSection
        title="التفضيلات المهنية"
        onEdit={() => onEdit(1)}
        items={[
          { label: 'حالتك الحالية', value: labelFor(CURRENT_STATUS_OPTIONS, preferences.current_status) },
          {
            label: 'الفرص المطلوبة',
            value: preferences.opportunity_preferences.map((v) => labelFor(OPPORTUNITY_PREFERENCES, v)).join('، '),
          },
          { label: 'نمط العمل المفضل', value: labelFor(WORK_MODE_OPTIONS, preferences.preferred_work_mode) },
        ]}
      />

      <ReviewSection
        title="الروابط"
        onEdit={() => onEdit(2)}
        items={[
          { label: 'LinkedIn', value: links.linkedin_url },
          { label: 'GitHub', value: links.github_url || '—' },
          { label: 'معرض الأعمال', value: links.portfolio_url || '—' },
          { label: 'الموقع الشخصي', value: links.personal_website_url || '—' },
        ]}
      />

      <ReviewSection
        title="السيرة الذاتية"
        onEdit={() => onEdit(2)}
        items={[{ label: 'الملف المرفق', value: cvExtension ? `تم رفع ملف ${cvExtension}` : 'تم رفع الملف' }]}
      />

      <div className="sticky bottom-0 -mx-4 mt-2 border-t border-border bg-background/95 p-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="button" size="lg" className="w-full" onClick={onSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="animate-spin" /> جارٍ الإرسال...
            </>
          ) : (
            <>
              إرسال ملفي <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
