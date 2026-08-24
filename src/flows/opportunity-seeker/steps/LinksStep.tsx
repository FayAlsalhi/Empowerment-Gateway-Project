import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';
import { CvUpload } from '@/components/form/CvUpload';
import { linksSchema, type LinksInput } from '@/schemas';

interface LinksStepProps {
  defaultValues?: Partial<LinksInput>;
  onNext: (values: LinksInput) => void;
  onBack: () => void;
}

export default function LinksStep({ defaultValues, onNext, onBack }: LinksStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LinksInput>({
    resolver: zodResolver(linksSchema),
    defaultValues: {
      linkedin_url: '',
      portfolio_url: '',
      personal_website_url: '',
      github_url: '',
      cv_path: '',
      ...defaultValues,
    },
  });

  const submit = handleSubmit((values) => onNext(values));

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <FormField label="السيرة الذاتية" required error={errors.cv_path?.message} hint="PDF أو DOC أو DOCX، حتى 5 ميجابايت">
        <Controller
          control={control}
          name="cv_path"
          render={({ field }) => (
            <CvUpload value={field.value} onChange={field.onChange} error={errors.cv_path?.message} />
          )}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="رابط LinkedIn" required error={errors.linkedin_url?.message}>
          <Input dir="ltr" placeholder="https://linkedin.com/in/username" {...register('linkedin_url')} />
        </FormField>
        <FormField label="رابط GitHub" error={errors.github_url?.message}>
          <Input dir="ltr" placeholder="https://github.com/username" {...register('github_url')} />
        </FormField>
        <FormField label="معرض الأعمال" error={errors.portfolio_url?.message}>
          <Input dir="ltr" placeholder="https://..." {...register('portfolio_url')} />
        </FormField>
        <FormField label="الموقع الشخصي" error={errors.personal_website_url?.message}>
          <Input dir="ltr" placeholder="https://..." {...register('personal_website_url')} />
        </FormField>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-2 flex gap-3 border-t border-border bg-background/95 p-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
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
