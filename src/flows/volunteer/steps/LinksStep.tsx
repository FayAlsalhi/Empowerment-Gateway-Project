import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';
import { CvUpload } from '@/components/form/CvUpload';
import { volunteerLinksSchema, type VolunteerLinksInput } from '@/schemas';

interface LinksStepProps {
  defaultValues?: Partial<VolunteerLinksInput>;
  onNext: (values: VolunteerLinksInput) => void;
  onBack: () => void;
}

/** الخطوة 4: الروابط والملفات — LinkedIn مطلوب، والسيرة الذاتية والروابط الأخرى اختيارية. */
export default function LinksStep({ defaultValues, onNext, onBack }: LinksStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VolunteerLinksInput>({
    resolver: zodResolver(volunteerLinksSchema),
    defaultValues: {
      linkedin_url: '',
      cv_path: '',
      github_url: '',
      personal_website_url: '',
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => onNext(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <p className="qt-kicker">الروابط والملفات</p>
        <h2 className="text-lg font-bold text-primary sm:text-xl">روابطك وملفاتك</h2>
        <p className="text-sm text-muted-foreground">كلها اختيارية — أضف ما يعرّفنا بك أكثر.</p>
      </div>

      <FormField label="رابط LinkedIn" hint="اختياري" error={errors.linkedin_url?.message}>
        <Input dir="ltr" placeholder="https://linkedin.com/in/username" {...register('linkedin_url')} />
      </FormField>

      <FormField label="السيرة الذاتية" error={errors.cv_path?.message} hint="اختياري — ملف PDF حتى 5 ميجابايت">
        <Controller
          control={control}
          name="cv_path"
          render={({ field }) => (
            <CvUpload value={field.value} onChange={field.onChange} error={errors.cv_path?.message} />
          )}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="رابط GitHub" error={errors.github_url?.message} hint="اختياري">
          <Input dir="ltr" placeholder="https://github.com/username" {...register('github_url')} />
        </FormField>
        <FormField label="الموقع الشخصي" error={errors.personal_website_url?.message} hint="اختياري">
          <Input dir="ltr" placeholder="https://..." {...register('personal_website_url')} />
        </FormField>
      </div>

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
