import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, UserRound } from 'lucide-react';
import { FormField } from '@/components/form/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SAUDI_REGIONS } from '@/lib/constants';
import { personalInfoSchema, type PersonalInfoInput } from '@/schemas';
import { SubmitBar } from './SubmitBar';

interface PersonalInfoStepProps {
  defaultValues: Partial<PersonalInfoInput>;
  onSubmit: (data: PersonalInfoInput) => Promise<void> | void;
  duplicateError: string | null;
}

/** الخطوة 1: بيانات التعريف والتواصل الأساسية. */
export function PersonalInfoStep({ defaultValues, onSubmit, duplicateError }: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  const region = watch('region');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
        <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          عرّفنا بنفسك بإيجاز حتى نتمكّن من التواصل معك عند وجود فرصة مناسبة لخبرتك.
        </p>
      </div>

      {duplicateError && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {duplicateError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="الاسم الكامل" required error={errors.full_name?.message}>
          <Input placeholder="مثال: سارة عبدالله" {...register('full_name')} />
        </FormField>
        <FormField label="البريد الإلكتروني" required error={errors.email?.message}>
          <Input type="email" dir="ltr" placeholder="name@example.com" {...register('email')} />
        </FormField>
        <FormField label="رقم الجوال" required error={errors.phone?.message}>
          <Input type="tel" dir="ltr" placeholder="05xxxxxxxx" {...register('phone')} />
        </FormField>
        <FormField label="المدينة" required error={errors.city?.message}>
          <Input placeholder="مثال: الرياض" {...register('city')} />
        </FormField>
        <FormField label="المنطقة" required error={errors.region?.message}>
          <Select value={region || undefined} onValueChange={(v) => setValue('region', v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المنطقة" />
            </SelectTrigger>
            <SelectContent>
              {SAUDI_REGIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label="العنوان المهني"
          required
          hint="مثال: مستشار تسويق رقمي"
          error={errors.professional_headline?.message}
        >
          <Input placeholder="مسمّاك المهني المختصر" {...register('professional_headline')} />
        </FormField>
      </div>

      <FormField label="نبذة عنك" required hint="20 حرفاً على الأقل" error={errors.bio?.message}>
        <Textarea rows={4} placeholder="اكتب نبذة مختصرة عن خبرتك واهتماماتك..." {...register('bio')} />
      </FormField>

      <SubmitBar label="التالي" loading={isSubmitting} />
    </form>
  );
}
