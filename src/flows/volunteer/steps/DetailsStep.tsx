import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/form/FormField';
import { OptionCards } from '@/components/form/OptionCards';
import { MultiSelectChips } from '@/components/form/MultiSelectChips';
import {
  SPECIALIZATIONS,
  SKILLS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  HAS_VOLUNTEERED_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
  AVAILABILITY_TIMES,
  PARTICIPATION_MODE_OPTIONS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { volunteerDetailsSchema, type VolunteerDetailsInput } from '@/schemas';

const WHAT_CAN_OFFER_MAX = 300;

interface DetailsStepProps {
  defaultValues?: Partial<VolunteerDetailsInput>;
  onNext: (values: VolunteerDetailsInput) => void;
  onBack: () => void;
}

/** الخطوة 3: تفاصيل المساهمة — التخصص، المهارات، الخبرة، التوفر، وما يمكن تقديمه للجمعية. */
export default function DetailsStep({ defaultValues, onNext, onBack }: DetailsStepProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<VolunteerDetailsInput>({
    resolver: zodResolver(volunteerDetailsSchema),
    defaultValues: {
      specialization: '',
      skills: [],
      years_of_experience: '',
      has_volunteered: '',
      weekly_hours: '',
      availability_times: [],
      participation_mode: '',
      what_can_offer: '',
      ...defaultValues,
    },
  });

  const whatCanOffer = watch('what_can_offer') ?? '';
  const remaining = WHAT_CAN_OFFER_MAX - whatCanOffer.length;

  const submit = handleSubmit((values) => onNext(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <p className="qt-kicker">تفاصيل المساهمة</p>
        <h2 className="text-lg font-bold text-primary sm:text-xl">وش تقدر تضيف؟</h2>
        <p className="text-sm text-muted-foreground">مهاراتك وأوقات توفرك وما تستطيع تقديمه.</p>
      </div>

      <FormField
        label="التخصص"
        error={errors.specialization?.message}
        hint="اختياري — اختر من القائمة أو اكتب تخصصك"
      >
        <Input list="volunteer-specializations" placeholder="مثال: هندسة البرمجيات" {...register('specialization')} />
        <datalist id="volunteer-specializations">
          {SPECIALIZATIONS.map((option) => (
            <option key={option.value} value={option.label} />
          ))}
        </datalist>
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

      <FormField label="سنوات الخبرة في هذه المهارة" error={errors.years_of_experience?.message}>
        <Controller
          control={control}
          name="years_of_experience"
          render={({ field }) => (
            <OptionCards options={YEARS_OF_EXPERIENCE_OPTIONS} value={field.value ?? ''} onChange={field.onChange} columns={3} />
          )}
        />
      </FormField>

      <FormField label="هل سبق لك التطوع؟" error={errors.has_volunteered?.message}>
        <Controller
          control={control}
          name="has_volunteered"
          render={({ field }) => (
            <OptionCards options={HAS_VOLUNTEERED_OPTIONS} value={field.value ?? ''} onChange={field.onChange} columns={2} />
          )}
        />
      </FormField>

      <FormField label="عدد الساعات المتاحة أسبوعياً" error={errors.weekly_hours?.message}>
        <Controller
          control={control}
          name="weekly_hours"
          render={({ field }) => (
            <OptionCards options={WEEKLY_HOURS_OPTIONS} value={field.value ?? ''} onChange={field.onChange} columns={2} />
          )}
        />
      </FormField>

      <FormField
        label="أوقات التوفر"
        error={errors.availability_times?.message}
        hint="يمكنك اختيار أكثر من وقت"
      >
        <Controller
          control={control}
          name="availability_times"
          render={({ field }) => (
            <MultiSelectChips options={AVAILABILITY_TIMES} value={field.value} onChange={field.onChange} />
          )}
        />
      </FormField>

      <FormField label="طريقة المشاركة" error={errors.participation_mode?.message}>
        <Controller
          control={control}
          name="participation_mode"
          render={({ field }) => (
            <OptionCards options={PARTICIPATION_MODE_OPTIONS} value={field.value ?? ''} onChange={field.onChange} columns={3} />
          )}
        />
      </FormField>

      <FormField label="ماذا تستطيع أن تقدم للجمعية؟" required error={errors.what_can_offer?.message}>
        <div className="flex flex-col gap-1.5">
          <Textarea
            rows={4}
            maxLength={WHAT_CAN_OFFER_MAX}
            placeholder="اكتب باختصار كيف يمكنك المساهمة والإضافة للجمعية..."
            {...register('what_can_offer')}
          />
          <span
            className={cn(
              'self-end text-xs font-medium tabular-nums',
              remaining <= 20 ? 'text-warning' : 'text-muted-foreground',
              remaining <= 0 && 'text-destructive'
            )}
          >
            {whatCanOffer.length}/{WHAT_CAN_OFFER_MAX}
          </span>
        </div>
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
