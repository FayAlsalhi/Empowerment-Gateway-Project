import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase } from 'lucide-react';
import { FormField } from '@/components/form/FormField';
import { Input } from '@/components/ui/input';
import { OptionCards } from '@/components/form/OptionCards';
import { EMPLOYMENT_STATUS_OPTIONS, YEARS_OF_EXPERIENCE_OPTIONS, EDUCATION_LEVEL_OPTIONS } from '@/lib/constants';
import { expertProfessionalSchema, type ExpertProfessionalInput } from '@/schemas';
import { SubmitBar } from './SubmitBar';

interface ProfessionalStepProps {
  defaultValues: Partial<ExpertProfessionalInput>;
  onSubmit: (data: ExpertProfessionalInput) => void;
}

/** الخطوة 2: المعلومات المهنية الأساسية للخبير — بدون تاريخ خبرات أو قوائم مهارات تفصيلية. */
export function ProfessionalStep({ defaultValues, onSubmit }: ProfessionalStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpertProfessionalInput>({
    resolver: zodResolver(expertProfessionalSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
        <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          أخبرنا عن وضعك المهني الحالي باختصار، دون الحاجة لسرد خبراتك السابقة بالتفصيل.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="المسمى الوظيفي الحالي" required error={errors.current_job_title?.message}>
          <Input placeholder="مثال: مدير منتج" {...register('current_job_title')} />
        </FormField>
        <FormField label="جهة العمل الحالية" hint="اختياري" error={errors.current_organization?.message}>
          <Input placeholder="مثال: شركة كذا" {...register('current_organization')} />
        </FormField>
      </div>

      <FormField label="التخصص" required error={errors.specialization?.message}>
        <Input placeholder="مثال: التسويق الرقمي" {...register('specialization')} />
      </FormField>

      <FormField label="الحالة الوظيفية" required error={errors.employment_status?.message}>
        <Controller
          name="employment_status"
          control={control}
          render={({ field }) => (
            <OptionCards options={EMPLOYMENT_STATUS_OPTIONS} value={field.value ?? ''} onChange={field.onChange} columns={3} />
          )}
        />
      </FormField>

      <FormField label="سنوات الخبرة" required error={errors.years_of_experience?.message}>
        <Controller
          name="years_of_experience"
          control={control}
          render={({ field }) => (
            <OptionCards options={YEARS_OF_EXPERIENCE_OPTIONS} value={field.value ?? ''} onChange={field.onChange} columns={3} />
          )}
        />
      </FormField>

      <FormField label="المؤهل العلمي" required error={errors.education_level?.message}>
        <Controller
          name="education_level"
          control={control}
          render={({ field }) => (
            <OptionCards options={EDUCATION_LEVEL_OPTIONS} value={field.value ?? ''} onChange={field.onChange} columns={3} />
          )}
        />
      </FormField>

      <SubmitBar label="التالي" loading={isSubmitting} />
    </form>
  );
}
