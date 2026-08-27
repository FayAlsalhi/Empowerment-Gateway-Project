import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { SAUDI_REGIONS } from '@/lib/constants';
import { identitySchema, type IdentityInput } from '@/schemas';

interface IdentityStepProps {
  defaultValues?: Partial<IdentityInput>;
  onNext: (values: IdentityInput) => Promise<void>;
}

/** الخطوة 1: بياناتك — الاسم، البريد، الجوال، المنطقة، ونبذة عنك. */
export default function IdentityStep({ defaultValues, onNext }: IdentityStepProps) {
  const [isChecking, setIsChecking] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IdentityInput>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      region: '',
      bio: '',
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
      <div className="flex flex-col gap-2">
        <p className="qt-kicker">بياناتك</p>
        <h2 className="text-lg font-bold text-primary sm:text-xl">لنتعرّف عليك</h2>
        <p className="text-sm text-muted-foreground">معلوماتك الأساسية ونبذة تعرّفنا بك.</p>
      </div>

      <div className="flex items-start gap-3 rounded-card border border-border bg-secondary p-4">
        <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p className="text-sm text-muted-foreground">
          كل ما تشاركه هنا يبقى خاصاً بجمعية القصيم التقنية ولا يُعرض لأي جهة أخرى.
        </p>
      </div>

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
        <FormField label="المنطقة" required error={errors.region?.message}>
          <Controller
            control={control}
            name="region"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
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
      </div>

      <FormField
        label="نبذة عنك"
        required
        error={errors.bio?.message}
        hint="30 إلى 600 حرف"
      >
        <Textarea
          rows={4}
          placeholder="عرّفنا عن نفسك باختصار، وما الذي يميزك؟ اكتب نبذة تشجعنا على التعرّف أكثر على خبراتك ومهاراتك."
          {...register('bio')}
        />
      </FormField>

      <div className="sticky bottom-0 -mx-4 mt-2 border-t border-border bg-white p-4 shadow-soft sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
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
