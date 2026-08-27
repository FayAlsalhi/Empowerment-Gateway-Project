import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';
import { OptionCards } from '@/components/form/OptionCards';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import { SPECIALIZATIONS, YEARS_OF_EXPERIENCE_OPTIONS, EDUCATION_LEVEL_OPTIONS, SKILLS } from '@/lib/constants';
import { expertProfessionalSchema, type ExpertProfessionalInput } from '@/schemas';

interface ProfessionalStepProps {
  defaultValues?: Partial<ExpertProfessionalInput>;
  onNext: (values: ExpertProfessionalInput) => void;
  onBack: () => void;
}

/** الخطوة 2: البيانات المهنية — التخصص، المسمى، جهة العمل، الخبرة، المؤهل، والمهارات فقط. */
export default function ProfessionalStep({ defaultValues, onNext, onBack }: ProfessionalStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExpertProfessionalInput>({
    resolver: zodResolver(expertProfessionalSchema),
    defaultValues: {
      specialization: '',
      current_job_title: '',
      current_organization: '',
      years_of_experience: '',
      education_level: '',
      skills: [],
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => onNext(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <p className="qt-kicker">البيانات المهنية</p>
        <h2 className="text-lg font-bold text-primary sm:text-xl">مسارك المهني</h2>
        <p className="text-sm text-muted-foreground">تخصصك وموقعك الحالي ومهاراتك.</p>
      </div>


      <FormField
        label="التخصص"
        required
        error={errors.specialization?.message}
        hint="اختر من القائمة أو اكتب تخصصك"
      >
        <Input list="expert-specializations" placeholder="مثال: الاستشارات التقنية" {...register('specialization')} />
        <datalist id="expert-specializations">
          {SPECIALIZATIONS.map((option) => (
            <option key={option.value} value={option.label} />
          ))}
        </datalist>
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="المسمى الوظيفي الحالي" required error={errors.current_job_title?.message}>
          <Input placeholder="مثال: مدير منتج" {...register('current_job_title')} />
        </FormField>
        <FormField label="جهة العمل الحالية" required error={errors.current_organization?.message}>
          <Input placeholder="مثال: شركة كذا" {...register('current_organization')} />
        </FormField>
      </div>

      <FormField label="سنوات الخبرة" required error={errors.years_of_experience?.message}>
        <Controller
          control={control}
          name="years_of_experience"
          render={({ field }) => (
            <OptionCards options={YEARS_OF_EXPERIENCE_OPTIONS} value={field.value} onChange={field.onChange} columns={3} />
          )}
        />
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
