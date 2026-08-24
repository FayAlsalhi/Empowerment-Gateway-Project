import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link2 } from 'lucide-react';
import { FormField } from '@/components/form/FormField';
import { Input } from '@/components/ui/input';
import { CvUpload } from '@/components/form/CvUpload';
import { linksSchema, type LinksInput } from '@/schemas';
import { SubmitBar } from './SubmitBar';

interface LinksStepProps {
  defaultValues: Partial<LinksInput>;
  onSubmit: (data: LinksInput) => void;
}

/** الخطوة 4: الروابط المهنية والسيرة الذاتية. */
export function LinksStep({ defaultValues, onSubmit }: LinksStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LinksInput>({
    resolver: zodResolver(linksSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
        <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          أضف روابطك المهنية وارفع سيرتك الذاتية ليتعرّف عليك فريقنا بشكل أفضل.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="رابط LinkedIn" required error={errors.linkedin_url?.message}>
          <Input dir="ltr" placeholder="https://linkedin.com/in/username" {...register('linkedin_url')} />
        </FormField>
        <FormField label="الموقع الشخصي" hint="اختياري" error={errors.personal_website_url?.message}>
          <Input dir="ltr" placeholder="https://example.com" {...register('personal_website_url')} />
        </FormField>
        <FormField label="معرض الأعمال" hint="اختياري" error={errors.portfolio_url?.message}>
          <Input dir="ltr" placeholder="https://..." {...register('portfolio_url')} />
        </FormField>
        <FormField label="رابط GitHub" hint="اختياري" error={errors.github_url?.message}>
          <Input dir="ltr" placeholder="https://github.com/username" {...register('github_url')} />
        </FormField>
      </div>

      <FormField label="السيرة الذاتية" required hint="PDF أو DOC أو DOCX، حتى 5 ميجابايت" error={errors.cv_path?.message}>
        <Controller
          name="cv_path"
          control={control}
          render={({ field }) => <CvUpload value={field.value} onChange={field.onChange} error={errors.cv_path?.message} />}
        />
      </FormField>

      <SubmitBar label="التالي" loading={isSubmitting} />
    </form>
  );
}
