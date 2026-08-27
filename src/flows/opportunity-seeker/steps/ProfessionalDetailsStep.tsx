import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';
import { OptionCards } from '@/components/form/OptionCards';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import {
  CURRENT_STATUS_OPTIONS,
  SPECIALIZATIONS,
  EDUCATION_LEVEL_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  OPPORTUNITY_TYPE_OPTIONS,
  SKILLS,
} from '@/lib/constants';
import { seekerDetailsSchema, type SeekerDetailsInput } from '@/schemas';

interface ProfessionalDetailsStepProps {
  defaultValues?: Partial<SeekerDetailsInput>;
  onNext: (values: SeekerDetailsInput) => void;
  onBack: () => void;
}

/** الخطوة 2: تفاصيلك المهنية — الحالة، التخصص، المؤهل، المسمى المستهدف، الخبرة، نوع الفرصة، والمهارات. */
export default function ProfessionalDetailsStep({ defaultValues, onNext, onBack }: ProfessionalDetailsStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SeekerDetailsInput>({
    resolver: zodResolver(seekerDetailsSchema),
    defaultValues: {
      current_status: '',
      specialization: '',
      education_level: '',
      target_job_title: '',
      years_of_experience: '',
      opportunity_preferences: [],
      skills: [],
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => onNext(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <p className="qt-kicker">التفاصيل المهنية</p>
        <h2 className="text-lg font-bold text-primary sm:text-xl">خبرتك وتطلعاتك</h2>
        <p className="text-sm text-muted-foreground">
          ساعدنا في فهم وضعك الحالي وما تبحث عنه لنطابقك بأفضل الفرص المتاحة.
        </p>
      </div>

      <FormField label="ما هي حالتك الحالية؟" required error={errors.current_status?.message}>
        <Controller
          control={control}
          name="current_status"
          render={({ field }) => (
            <OptionCards options={CURRENT_STATUS_OPTIONS} value={field.value} onChange={field.onChange} columns={2} />
          )}
        />
      </FormField>

      <FormField
        label="التخصص"
        required
        error={errors.specialization?.message}
        hint="اختر من القائمة أو اكتب تخصصك"
      >
        <Input list="seeker-specializations" placeholder="مثال: هندسة البرمجيات" {...register('specialization')} />
        <datalist id="seeker-specializations">
          {SPECIALIZATIONS.map((option) => (
            <option key={option.value} value={option.label} />
          ))}
        </datalist>
      </FormField>

      <FormField label="المؤهل العلمي" required error={errors.education_level?.message}>
        <Controller
          control={control}
          name="education_level"
          render={({ field }) => (
            <OptionCards options={EDUCATION_LEVEL_OPTIONS} value={field.value} onChange={field.onChange} columns={3} />
          )}
        />
      </FormField>

      <FormField label="المسمى الوظيفي المستهدف" required error={errors.target_job_title?.message}>
        <Input placeholder="مثال: مطوّر واجهات أمامية" {...register('target_job_title')} />
      </FormField>

      <FormField label="سنوات الخبرة" required error={errors.years_of_experience?.message}>
        <Controller
          control={control}
          name="years_of_experience"
          render={({ field }) => (
            <OptionCards options={YEARS_OF_EXPERIENCE_OPTIONS} value={field.value} onChange={field.onChange} columns={3} />
          )}
        />
      </FormField>

      <FormField
        label="ما نوع الفرصة التي تبحث عنها؟"
        required
        error={errors.opportunity_preferences?.message}
        hint="يمكنك اختيار أكثر من نوع"
      >
        <Controller
          control={control}
          name="opportunity_preferences"
          render={({ field }) => (
            <MultiSelectChips
              options={OPPORTUNITY_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              allowCustom
              placeholder="اكتب نوع فرصة آخر..."
            />
          )}
        />
      </FormField>

      <FormField label="المهارات" required error={errors.skills?.message} hint="اختر مهاراتك أو أضف مهارة غير موجودة">
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <MultiSelectChips
              options={SKILLS}
              value={field.value}
              onChange={field.onChange}
              allowCustom
              placeholder="أضف مهارة أخرى..."
            />
          )}
        />
      </FormField>

      <div className="sticky bottom-0 -mx-4 mt-2 flex gap-3 border-t border-border bg-white p-4 shadow-soft sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          <ArrowRight className="h-4 w-4" /> السابق
        </Button>
        <Button type="submit" size="lg" className="flex-1">
          التالي <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
