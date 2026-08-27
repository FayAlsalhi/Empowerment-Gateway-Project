import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogIn, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FormField } from '@/components/form/FormField';
import { useToast } from '@/components/ui/toast';
import { adminSignIn } from '@/lib/admin';
import { adminLoginSchema, type AdminLoginInput } from '@/schemas';
import { BRAND } from '@/lib/brand';

/** شاشة دخول مسؤولي لوحة الإدارة — بهوية جمعية القصيم التقنية. */
export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoError, setLogoError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: AdminLoginInput) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await adminSignIn(values.email, values.password);
      navigate('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'تعذّر تسجيل الدخول. يرجى المحاولة مرة أخرى.';
      setSubmitError(message);
      toast({ title: 'تعذّر تسجيل الدخول', description: message, variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="qt-hero-bg flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
          {!logoError ? (
            <img
              src={BRAND.logoSrc}
              alt={BRAND.nameAr}
              className="h-full w-full object-contain p-2"
              onError={() => setLogoError(true)}
            />
          ) : (
            <Cpu className="h-8 w-8 text-primary" strokeWidth={1.75} />
          )}
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{BRAND.nameAr}</p>
          <p className="text-sm text-muted-foreground">{BRAND.tagline}</p>
        </div>
      </div>

      <Card className="w-full max-w-sm rounded-panel border-border shadow-showcase">
        <CardHeader className="items-center gap-1.5 pb-2 text-center">
          <p className="qt-kicker">لوحة الإدارة</p>
          <h1 className="qt-h2 text-[1.6rem] text-primary sm:text-[1.9rem]">تسجيل الدخول</h1>
          <p className="text-xs text-muted-foreground">سجّل الدخول للوصول إلى بيانات المسجّلين</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <FormField label="البريد الإلكتروني" required error={errors.email?.message}>
              <Input type="email" dir="ltr" placeholder="admin@example.com" {...register('email')} />
            </FormField>
            <FormField label="كلمة المرور" required error={errors.password?.message}>
              <Input type="password" dir="ltr" placeholder="••••••••" {...register('password')} />
            </FormField>

            {submitError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {submitError}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              تسجيل الدخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
