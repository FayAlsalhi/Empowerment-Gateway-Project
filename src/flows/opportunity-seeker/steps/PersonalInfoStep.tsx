import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { SAUDI_REGIONS } from '@/lib/constants';
import { personalInfoSchema, type PersonalInfoInput } from '@/schemas';

interface PersonalInfoStepProps {
  defaultValues?: Partial<PersonalInfoInput>;
  onNext: (values: PersonalInfoInput) => Promise<void>;
}

export default function PersonalInfoStep({ defaultValues, onNext }: PersonalInfoStepProps) {
  const [isChecking, setIsChecking] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      city: '',
      region: '',
      bio: '',
      professional_headline: '',
      ...defaultValues,
    },
  });

  const submit = handleSubmit(async (values) => {
    setIsChecking(true);
    try {
      await onNext(values);
    } finally {
      setIsChecking(false);
    }
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="الاسم الكامل" required error={errors.full_name?.message}>
          <Input placeholder="مثال: سارة العتيبي" {...register('full_name')} />
        </FormField>
        <FormField label="البريد الإلكتروني" required error={errors.email?.message}>
          <Input type="email" dir="ltr" placeholder="name@example.com" {...register('email')} />
        </FormField>
        <FormField label="رقم الجوال" required error={errors.phone?.message}>
          <Input type="tel" dir="ltr" placeholder="0512345678" {...register('phone')} />
        </FormField>
        <FormField label="المدينة" required error={errors.city?.message}>
          <Input placeholder="مثال: الرياض" {...register('city')} />
        </FormField>
        <FormField label="المنطقة" required error={errors.region?.message}>
          <Controller
            control={control}
            name="region"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {SAUDI_REGIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="العنوان المهني" required error={errors.professional_headline?.message} hint="مثال: مطوّر واجهات أمامية">
          <Input placeholder="مسمّاك المهني المختصر" {...register('professional_headline')} />
        </FormField>
      </div>

      <FormField label="نبذة عنك" required error={errors.bio?.message} hint="20 حرفاً على الأقل">
        <Textarea rows={4} placeholder="عرّف بنفسك، خبراتك، وما يميزك..." {...register('bio')} />
      </FormField>

      <div className="sticky bottom-0 -mx-4 mt-2 border-t border-border bg-background/95 p-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button type="submit" size="lg" className="w-full" disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="animate-spin" /> جارٍ التحقق...
            </>
          ) : (
            <>
              التالي <ArrowLeft className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
