import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeartHandshake } from 'lucide-react';
import { FormField } from '@/components/form/FormField';
import { OptionCards } from '@/components/form/OptionCards';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import {
  PARTICIPATION_TYPES,
  EXPERT_AREAS,
  CONTRIBUTION_TYPES,
  TARGET_AUDIENCES,
  DELIVERY_MODE_OPTIONS,
} from '@/lib/constants';
import { expertContributionSchema, type ExpertContributionInput } from '@/schemas';
import { SubmitBar } from './SubmitBar';

interface ContributionStepProps {
  defaultValues: Partial<ExpertContributionInput>;
  onSubmit: (data: ExpertContributionInput) => void;
}

/** الخطوة 3: طريقة المساهمة، مجالات الخبرة، والفئات المستهدفة. */
export function ContributionStep({ defaultValues, onSubmit }: ContributionStepProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpertContributionInput>({
    resolver: zodResolver(expertContributionSchema),
    defaultValues: {
      participation_types: [],
      areas: [],
      contribution_types: [],
      target_audiences: [],
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
        <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          حدّد الطريقة والمجالات التي ترغب أن تساهم بها ضمن بوابة التمكين.
        </p>
      </div>

      <FormField
        label="طريقة المشاركة"
        required
        hint="يمكنك اختيار أكثر من طريقة"
        error={errors.participation_types?.message}
      >
        <Controller
          name="participation_types"
          control={control}
          render={({ field }) => (
            <MultiSelectChips options={PARTICIPATION_TYPES} value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField
        label="مجالات خبرتك"
        required
        hint="اختر مجالاً أو أضف مجالاً غير موجود في القائمة"
        error={errors.areas?.message}
      >
        <Controller
          name="areas"
          control={control}
          render={({ field }) => (
            <MultiSelectChips
              options={EXPERT_AREAS}
              value={field.value ?? []}
              onChange={field.onChange}
              allowCustom
              placeholder="أضف مجالاً آخر..."
            />
          )}
        />
      </FormField>

      <FormField label="نوع المساهمة" required error={errors.contribution_types?.message}>
        <Controller
          name="contribution_types"
          control={control}
          render={({ field }) => (
            <MultiSelectChips options={CONTRIBUTION_TYPES} value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField label="الفئة المستهدفة" required error={errors.target_audiences?.message}>
        <Controller
          name="target_audiences"
          control={control}
          render={({ field }) => (
            <MultiSelectChips options={TARGET_AUDIENCES} value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField label="طريقة المشاركة المفضّلة" required error={errors.delivery_mode?.message}>
        <Controller
          name="delivery_mode"
          control={control}
          render={({ field }) => (
            <OptionCards options={DELIVERY_MODE_OPTIONS} value={field.value ?? ''} onChange={field.onChange} columns={3} />
          )}
        />
      </FormField>

      <SubmitBar label="التالي" loading={isSubmitting} />
    </form>
  );
}
