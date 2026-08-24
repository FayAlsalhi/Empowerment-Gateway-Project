import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';
import { OptionCards } from '@/components/form/OptionCards';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import { CURRENT_STATUS_OPTIONS, OPPORTUNITY_PREFERENCES, WORK_MODE_OPTIONS } from '@/lib/constants';
import { seekerPreferencesSchema, type SeekerPreferencesInput } from '@/schemas';

interface PreferencesStepProps {
  defaultValues?: Partial<SeekerPreferencesInput>;
  onNext: (values: SeekerPreferencesInput) => void;
  onBack: () => void;
}

export default function PreferencesStep({ defaultValues, onNext, onBack }: PreferencesStepProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SeekerPreferencesInput>({
    resolver: zodResolver(seekerPreferencesSchema),
    defaultValues: {
      current_status: '',
      opportunity_preferences: [],
      preferred_work_mode: '',
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => onNext(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <FormField label="ما هي حالتك الحالية؟" required error={errors.current_status?.message}>
        <Controller
          control={control}
          name="current_status"
          render={({ field }) => (
            <OptionCards options={CURRENT_STATUS_OPTIONS} value={field.value} onChange={field.onChange} columns={2} />
          )}
        />
      </FormField>

      <FormField label="ما نوع الفرص التي تبحث عنها؟" required error={errors.opportunity_preferences?.message} hint="يمكنك اختيار أكثر من نوع">
        <Controller
          control={control}
          name="opportunity_preferences"
          render={({ field }) => (
            <MultiSelectChips options={OPPORTUNITY_PREFERENCES} value={field.value} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField label="ما نمط العمل المفضل لديك؟" required error={errors.preferred_work_mode?.message}>
        <Controller
          control={control}
          name="preferred_work_mode"
          render={({ field }) => (
            <OptionCards options={WORK_MODE_OPTIONS} value={field.value} onChange={field.onChange} columns={2} />
          )}
        />
      </FormField>

      <div className="sticky bottom-0 -mx-4 mt-2 flex gap-3 border-t border-border bg-background/95 p-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
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
