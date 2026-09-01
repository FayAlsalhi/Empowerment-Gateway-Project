import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';
import { CvUpload } from '@/components/form/CvUpload';
import { seekerLinksSchema, type SeekerLinksInput } from '@/schemas';

interface LinksStepProps {
  defaultValues?: Partial<SeekerLinksInput>;
  onNext: (values: SeekerLinksInput) => void;
  onBack: () => void;
}

/** الخطوة 3: الروابط والملفات — السيرة الذاتية وLinkedIn مطلوبان، وGitHub والموقع الشخصي اختياريان. */
export default function LinksStep({ defaultValues, onNext, onBack }: LinksStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SeekerLinksInput>({
    resolver: zodResolver(seekerLinksSchema),
    defaultValues: {
      cv_path: '',
      linkedin_url: '',
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
        <h2 className="text-lg font-bold text-primary sm:text-xl">سيرتك الذاتية وروابطك</h2>
        <p className="text-sm text-muted-foreground">
          أضف سيرتك الذاتية وروابط تعرّفنا أكثر على أعمالك وخبراتك.
        </p>
      </div>

      <div className="flex flex-col gap-6 rounded-panel border border-accent/20 bg-accent/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm text-muted-foreground">
            سيرتك الذاتية ورابط LinkedIn مطلوبان حتى نتمكّن من التعرّف على مسارك المهني.
          </p>
        </div>

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
          <FormField label="رابط LinkedIn" hint="اختياري" error={errors.linkedin_url?.message}>
            <Input dir="ltr" placeholder="https://linkedin.com/in/username" {...register('linkedin_url')} />
          </FormField>
          <FormField label="رابط GitHub" error={errors.github_url?.message} hint="اختياري">
            <Input dir="ltr" placeholder="https://github.com/username" {...register('github_url')} />
          </FormField>
          <FormField label="الموقع الشخصي" error={errors.personal_website_url?.message} hint="اختياري">
            <Input dir="ltr" placeholder="https://..." {...register('personal_website_url')} />
          </FormField>
        </div>
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
