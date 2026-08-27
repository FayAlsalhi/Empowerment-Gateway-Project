import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';
import { OptionCards } from '@/components/form/OptionCards';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import { CONTRIBUTION_TYPES, PARTICIPATION_MODE_OPTIONS } from '@/lib/constants';
import { expertContributionSchema, type ExpertContributionInput } from '@/schemas';

interface ContributionStepProps {
  defaultValues?: Partial<ExpertContributionInput>;
  onNext: (values: ExpertContributionInput) => void;
  onBack: () => void;
}

/** الخطوة 3: نوع المساهمة وطريقة المشاركة. */
export default function ContributionStep({ defaultValues, onNext, onBack }: ContributionStepProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExpertContributionInput>({
    resolver: zodResolver(expertContributionSchema),
    defaultValues: {
      contribution_types: [],
      participation_mode: '',
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => onNext(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <p className="qt-kicker">نوع المساهمة</p>
        <h2 className="text-lg font-bold text-primary sm:text-xl">كيف تودّ أن تساهم؟</h2>
        <p className="text-sm text-muted-foreground">
          حدّد الطريقة التي ترغب أن تساهم بها ضمن جمعية القصيم التقنية.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-card border border-border bg-secondary p-4">
        <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p className="text-sm text-muted-foreground">اختر ما يناسب وقتك وخبرتك — ويمكنك اختيار أكثر من واحد.</p>
      </div>

      <FormField
        label="نوع المساهمة"
        required
        error={errors.contribution_types?.message}
        hint="يمكنك اختيار أكثر من نوع"
      >
        <Controller
          control={control}
          name="contribution_types"
          render={({ field }) => (
            <MultiSelectChips
              options={CONTRIBUTION_TYPES}
              value={field.value}
              onChange={field.onChange}
              allowCustom
              placeholder="اكتب نوع مساهمة آخر..."
            />
          )}
        />
      </FormField>

      <FormField label="طريقة المشاركة" required error={errors.participation_mode?.message}>
        <Controller
          control={control}
          name="participation_mode"
          render={({ field }) => (
            <OptionCards options={PARTICIPATION_MODE_OPTIONS} value={field.value} onChange={field.onChange} columns={3} />
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
