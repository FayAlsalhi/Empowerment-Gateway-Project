import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';
import { OptionCards } from '@/components/form/OptionCards';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import { VOLUNTEER_TYPE_OPTIONS, SPECIALIZED_INTERESTS, OPERATIONAL_INTERESTS } from '@/lib/constants';
import { volunteerDetailsSchema, type VolunteerDetailsInput } from '@/schemas';
import type { Option } from '@/types';

interface DetailsStepProps {
  defaultValues?: Partial<VolunteerDetailsInput>;
  onSubmit: (values: VolunteerDetailsInput) => void;
  onBack: () => void;
  submitting: boolean;
}

function mergeUnique(a: Option[], b: Option[]): Option[] {
  const seen = new Set<string>();
  return [...a, ...b].filter((option) => (seen.has(option.value) ? false : (seen.add(option.value), true)));
}

export default function DetailsStep({ defaultValues, onSubmit, onBack, submitting }: DetailsStepProps) {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VolunteerDetailsInput>({
    resolver: zodResolver(volunteerDetailsSchema),
    defaultValues: {
      volunteer_type: '',
      interests: [],
      ...defaultValues,
    },
  });

  const volunteerType = watch('volunteer_type');

  const interestOptions = useMemo(() => {
    if (volunteerType === 'specialized') return SPECIALIZED_INTERESTS;
    if (volunteerType === 'operational') return OPERATIONAL_INTERESTS;
    if (volunteerType === 'both') return mergeUnique(SPECIALIZED_INTERESTS, OPERATIONAL_INTERESTS);
    return [];
  }, [volunteerType]);

  const submit = handleSubmit((values) => onSubmit(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <FormField label="ما نوع التطوع الذي يناسبك؟" required error={errors.volunteer_type?.message}>
        <Controller
          control={control}
          name="volunteer_type"
          render={({ field }) => (
            <OptionCards
              options={VOLUNTEER_TYPE_OPTIONS}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setValue('interests', []);
              }}
              columns={3}
            />
          )}
        />
      </FormField>

      {volunteerType && (
        <FormField label="ما المجالات التي تهمّك؟" required error={errors.interests?.message} hint="يمكنك اختيار أكثر من مجال">
          <Controller
            control={control}
            name="interests"
            render={({ field }) => (
              <MultiSelectChips options={interestOptions} value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
      )}

      <div className="sticky bottom-0 -mx-4 mt-2 flex gap-3 border-t border-border bg-background/95 p-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={submitting}>
          <ArrowRight className="h-4 w-4" /> السابق
        </Button>
        <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="animate-spin" /> جارٍ التسجيل...
            </>
          ) : (
            <>
              تسجيل كمتطوع <HeartHandshake className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
