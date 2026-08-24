import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewSection } from '@/components/form/ReviewSection';
import {
  SAUDI_REGIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  PARTICIPATION_TYPES,
  EXPERT_AREAS,
  CONTRIBUTION_TYPES,
  TARGET_AUDIENCES,
  DELIVERY_MODE_OPTIONS,
  labelFor,
} from '@/lib/constants';
import type { Option } from '@/types';
import type { ExpertFormData } from '../ExpertFlow';

function listLabel(options: Option[], values: string[]): string {
  return values.length ? values.map((v) => labelFor(options, v)).join('، ') : '—';
}

interface ReviewStepProps {
  data: ExpertFormData;
  isSubmitting: boolean;
  onSubmit: () => void;
  onEdit: (step: number) => void;
}

/** الخطوة 5: مراجعة نهائية لكل البيانات المجمّعة قبل الإرسال. */
export function ReviewStep({ data, isSubmitting, onSubmit, onEdit }: ReviewStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <ReviewSection
        title="المعلومات الشخصية"
        onEdit={() => onEdit(0)}
        items={[
          { label: 'الاسم الكامل', value: data.full_name || '—' },
          { label: 'البريد الإلكتروني', value: data.email || '—' },
          { label: 'رقم الجوال', value: data.phone || '—' },
          { label: 'المدينة', value: data.city || '—' },
          { label: 'المنطقة', value: data.region ? labelFor(SAUDI_REGIONS, data.region) : '—' },
          { label: 'العنوان المهني', value: data.professional_headline || '—' },
          { label: 'نبذة عنك', value: data.bio || '—' },
        ]}
      />

      <ReviewSection
        title="المعلومات المهنية"
        onEdit={() => onEdit(1)}
        items={[
          { label: 'المسمى الوظيفي الحالي', value: data.current_job_title || '—' },
          { label: 'جهة العمل الحالية', value: data.current_organization || '—' },
          { label: 'التخصص', value: data.specialization || '—' },
          {
            label: 'الحالة الوظيفية',
            value: data.employment_status ? labelFor(EMPLOYMENT_STATUS_OPTIONS, data.employment_status) : '—',
          },
          {
            label: 'سنوات الخبرة',
            value: data.years_of_experience ? labelFor(YEARS_OF_EXPERIENCE_OPTIONS, data.years_of_experience) : '—',
          },
          {
            label: 'المؤهل العلمي',
            value: data.education_level ? labelFor(EDUCATION_LEVEL_OPTIONS, data.education_level) : '—',
          },
        ]}
      />

      <ReviewSection
        title="المساهمة"
        onEdit={() => onEdit(2)}
        items={[
          { label: 'طريقة المشاركة', value: listLabel(PARTICIPATION_TYPES, data.participation_types ?? []) },
          { label: 'مجالات الخبرة', value: listLabel(EXPERT_AREAS, data.areas ?? []) },
          { label: 'نوع المساهمة', value: listLabel(CONTRIBUTION_TYPES, data.contribution_types ?? []) },
          { label: 'الفئة المستهدفة', value: listLabel(TARGET_AUDIENCES, data.target_audiences ?? []) },
          {
            label: 'طريقة المشاركة المفضّلة',
            value: data.delivery_mode ? labelFor(DELIVERY_MODE_OPTIONS, data.delivery_mode) : '—',
          },
        ]}
      />

      <ReviewSection
        title="الروابط"
        onEdit={() => onEdit(3)}
        items={[
          { label: 'LinkedIn', value: data.linkedin_url || '—' },
          { label: 'الموقع الشخصي', value: data.personal_website_url || '—' },
          { label: 'معرض الأعمال', value: data.portfolio_url || '—' },
          { label: 'GitHub', value: data.github_url || '—' },
        ]}
      />

      <ReviewSection
        title="السيرة الذاتية"
        onEdit={() => onEdit(3)}
        items={[{ label: 'الملف', value: data.cv_path ? 'تم رفع السيرة الذاتية بنجاح' : '—' }]}
      />

      <div className="sticky bottom-0 -mx-4 mt-2 flex justify-end border-t border-border/70 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <Button
          type="button"
          size="lg"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="h-14 w-full gap-2 text-base sm:h-12 sm:w-auto sm:min-w-[12rem]"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          إرسال ملف الخبير
        </Button>
      </div>
    </div>
  );
}
