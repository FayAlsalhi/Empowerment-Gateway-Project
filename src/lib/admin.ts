import { supabase } from '@/lib/supabase';
import { CV_BUCKET } from '@/lib/submissions';
import type {
  InternalStatus,
  ProfileType,
  SectionStats,
  TalentFilters,
  TalentRow,
} from '@/types';

/** هل المستخدم الحالي مسؤول؟ (تُحسم في قاعدة البيانات) */
export async function isAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return Boolean(data);
}

export async function adminSignIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(
      error.message.toLowerCase().includes('invalid')
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
        : 'تعذّر تسجيل الدخول. يرجى المحاولة مرة أخرى.'
    );
  }
  if (!(await isAdmin())) {
    await supabase.auth.signOut();
    throw new Error('هذا الحساب لا يملك صلاحية الوصول إلى لوحة الإدارة.');
  }
}

export async function adminSignOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** جلب المسجّلين في مسار معيّن مع الفلاتر. */
export async function listTalent(
  profileType: ProfileType,
  filters: TalentFilters = {}
): Promise<TalentRow[]> {
  let q = supabase
    .from('talent_pool')
    .select('*')
    .eq('profile_type', profileType)
    .order('created_at', { ascending: false });

  if (filters.region) q = q.eq('region', filters.region);
  if (filters.internalStatus) q = q.eq('internal_status', filters.internalStatus);
  if (filters.currentStatus) q = q.eq('current_status', filters.currentStatus);
  if (filters.yearsOfExperience) q = q.eq('years_of_experience', filters.yearsOfExperience);
  if (filters.specialization) q = q.ilike('specialization', `%${filters.specialization}%`);
  if (filters.targetJobTitle) q = q.ilike('target_job_title', `%${filters.targetJobTitle}%`);
  if (filters.skills?.length) q = q.overlaps('skills', filters.skills);
  if (filters.opportunityType) q = q.contains('opportunity_types', [filters.opportunityType]);

  if (filters.search?.trim()) {
    const s = filters.search.trim();
    q = q.or(
      `full_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%,` +
        `specialization.ilike.%${s}%,target_job_title.ilike.%${s}%,current_job_title.ilike.%${s}%`
    );
  }

  const { data, error } = await q;
  if (error) throw new Error('تعذّر تحميل البيانات.');
  return (data ?? []) as TalentRow[];
}

/** تغيير الحالة الداخلية للمرشح. */
export async function updateInternalStatus(
  id: string,
  status: InternalStatus,
  note?: string
): Promise<void> {
  const patch: Record<string, unknown> = { internal_status: status };
  if (note !== undefined) patch.status_note = note;

  const { error } = await supabase.from('profiles').update(patch).eq('id', id);
  if (error) throw new Error('تعذّر تحديث الحالة.');
}

/** رابط مؤقت لفتح/تحميل السيرة الذاتية (صالح ساعة). */
export async function getCvUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(CV_BUCKET)
    .createSignedUrl(path, 3600);
  if (error || !data) throw new Error('تعذّر فتح السيرة الذاتية.');
  return data.signedUrl;
}

/** إحصائيات أعلى كل قسم. */
export function computeStats(rows: TalentRow[]): SectionStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  return {
    total: rows.length,
    thisMonth: rows.filter((r) => new Date(r.created_at).getTime() >= monthStart).length,
    shortlisted: rows.filter((r) => r.internal_status === 'shortlisted').length,
    contacted: rows.filter((r) => r.internal_status === 'contacted').length,
  };
}

/** تصدير CSV (مع BOM ليفتح صحيحاً في Excel العربي). */
export function exportCsv(rows: TalentRow[], filename: string): void {
  if (rows.length === 0) return;
  const cols: (keyof TalentRow)[] = [
    'full_name', 'email', 'phone', 'region', 'specialization', 'education_level',
    'years_of_experience', 'target_job_title', 'current_status', 'current_job_title',
    'current_organization', 'skills', 'internal_status', 'created_at',
  ];
  const head = [
    'الاسم', 'البريد', 'الجوال', 'المنطقة', 'التخصص', 'المؤهل', 'سنوات الخبرة',
    'المسمى المستهدف', 'الحالة الحالية', 'المسمى الوظيفي', 'جهة العمل',
    'المهارات', 'الحالة الداخلية', 'تاريخ التسجيل',
  ];
  const cell = (v: unknown): string => {
    const s = Array.isArray(v) ? v.join(' | ') : v == null ? '' : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [
    head.map(cell).join(','),
    ...rows.map((r) => cols.map((c) => cell(r[c])).join(',')),
  ].join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
