import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import { VOLUNTEER_TYPE_OPTIONS } from '@/lib/constants';
import { volunteerTypeSchema, type VolunteerTypeInput } from '@/schemas';

interface VolunteerTypeStepProps {
  defaultValues?: Partial<VolunteerTypeInput>;
  onNext: (values: VolunteerTypeInput) => void;
  onBack: () => void;
}

/** الخطوة 2: نوع التطوع — يمكن اختيار أكثر من نوع. */
export default function VolunteerTypeStep({ defaultValues, onNext, onBack }: VolunteerTypeStepProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VolunteerTypeInput>({
    resolver: zodResolver(volunteerTypeSchema),
    defaultValues: {
      volunteer_types: [],
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => onNext(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <p className="qt-kicker">نوع التطوع</p>
        <h2 className="text-lg font-bold text-primary sm:text-xl">كيف تحب تتطوع؟</h2>
        <p className="text-sm text-muted-foreground">اختر المجالات التي تناسب مهاراتك — يمكنك اختيار أكثر من واحد.</p>
      </div>

      <FormField
        label="ما نوع التطوع الذي يناسبك؟"
        required
        error={errors.volunteer_types?.message}
        hint="يمكنك اختيار أكثر من نوع"
      >
        <Controller
          control={control}
          name="volunteer_types"
          render={({ field }) => (
            <MultiSelectChips
              options={VOLUNTEER_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              allowCustom
              placeholder="اكتب نوع تطوع آخر..."
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
