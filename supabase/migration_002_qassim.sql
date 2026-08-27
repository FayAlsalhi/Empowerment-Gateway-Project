-- ============================================================================
-- جمعية القصيم التقنية — ترحيل 002
-- تعديل تراكمي على المخطط الحالي (لا يحذف بيانات قائمة)
-- نفّذه بعد schema.sql في: Supabase → SQL Editor → Run
-- ============================================================================

create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------------------
-- 1) أنواع جديدة
-- ---------------------------------------------------------------------------
do $$ begin
  create type internal_status as enum
    ('new','reviewed','shortlisted','contacted','matched','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type participation_mode as enum ('onsite','remote','both');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2) الجدول الرئيسي: مهارات + حالة داخلية
-- ---------------------------------------------------------------------------
alter table profiles
  add column if not exists skills            text[] not null default '{}',
  add column if not exists internal_status   internal_status not null default 'new',
  add column if not exists status_note       text,
  add column if not exists status_updated_at timestamptz;

-- المدينة لم تعد تُجمع (المنطقة تكفي)، والنبذة/العنوان المهني اختياريان حسب المسار
alter table profiles alter column city drop not null;
alter table profiles alter column bio drop not null;
alter table profiles alter column professional_headline drop not null;

create index if not exists idx_profiles_skills   on profiles using gin (skills);
create index if not exists idx_profiles_status   on profiles(internal_status);
create index if not exists idx_profiles_region   on profiles(region);
create index if not exists idx_profiles_created  on profiles(created_at desc);
create index if not exists idx_profiles_fullname on profiles using gin (full_name gin_trgm_ops);

create or replace function touch_status_updated()
returns trigger language plpgsql as $fn$
begin
  if new.internal_status is distinct from old.internal_status then
    new.status_updated_at = now();
  end if;
  return new;
end $fn$;

drop trigger if exists trg_profiles_status on profiles;
create trigger trg_profiles_status before update on profiles
  for each row execute function touch_status_updated();

-- ---------------------------------------------------------------------------
-- 3) مسار الباحث عن فرصة
-- ---------------------------------------------------------------------------
alter table opportunity_seeker_profiles
  add column if not exists specialization      text,
  add column if not exists education_level     text,
  add column if not exists target_job_title    text,
  add column if not exists years_of_experience text;

-- معرض الأعمال لم يعد مطلوباً (يكفي الموقع الشخصي)
alter table opportunity_seeker_profiles drop column if exists portfolio_url;
-- نمط العمل لم يعد ضمن النموذج
alter table opportunity_seeker_profiles alter column preferred_work_mode drop not null;
alter table opportunity_seeker_profiles alter column linkedin_url drop not null;

-- ---------------------------------------------------------------------------
-- 4) مسار الخبير
-- ---------------------------------------------------------------------------
alter table expert_profiles
  add column if not exists participation_mode participation_mode;

update expert_profiles
set participation_mode = delivery_mode::text::participation_mode
where participation_mode is null;

alter table expert_profiles drop column if exists portfolio_url;
alter table expert_profiles alter column employment_status drop not null;

-- ---------------------------------------------------------------------------
-- 5) مسار التطوع — توسعة للفرز المستقبلي
-- ---------------------------------------------------------------------------
alter table volunteer_profiles
  add column if not exists specialization       text,
  add column if not exists years_of_experience  text,
  add column if not exists has_volunteered      boolean,
  add column if not exists weekly_hours         text,
  add column if not exists availability_times   text[] not null default '{}',
  add column if not exists participation_mode   participation_mode,
  add column if not exists linkedin_url         text,
  add column if not exists github_url           text,
  add column if not exists personal_website_url text,
  add column if not exists cv_path              text,
  add column if not exists what_can_offer       text;

create table if not exists volunteer_types (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null references profiles(id) on delete cascade,
  volunteer_type text not null,
  unique (profile_id, volunteer_type)
);
create index if not exists idx_vol_types_profile on volunteer_types(profile_id);
alter table volunteer_types enable row level security;

alter table volunteer_profiles alter column volunteer_type drop not null;

-- ---------------------------------------------------------------------------
-- 6) حسابات الإدارة — لوحة التحكم تحتاج قراءة، والزائر لا
-- ---------------------------------------------------------------------------
create table if not exists admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  created_at timestamptz not null default now()
);
alter table admin_users enable row level security;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $fn$
  select exists (select 1 from admin_users where id = auth.uid());
$fn$;

grant execute on function is_admin() to authenticated;
grant select on admin_users to authenticated;

drop policy if exists admin_self_read on admin_users;
create policy admin_self_read on admin_users
  for select to authenticated using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7) صلاحيات القراءة للإدارة فقط (الزائر يبقى بلا أي قراءة)
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','opportunity_seeker_profiles','opportunity_preferences',
    'expert_profiles','expert_participation_types','expert_areas',
    'expert_contribution_types','expert_target_audiences',
    'volunteer_profiles','volunteer_interests','volunteer_types'
  ] loop
    execute format('drop policy if exists %I on %I', t || '_admin_read', t);
    execute format(
      'create policy %I on %I for select to authenticated using (public.is_admin())',
      t || '_admin_read', t
    );
    execute format('grant select on %I to authenticated', t);
  end loop;
end $$;

drop policy if exists profiles_admin_update on profiles;
create policy profiles_admin_update on profiles
  for update to authenticated using (is_admin()) with check (is_admin());
grant update (internal_status, status_note) on profiles to authenticated;

-- ---------------------------------------------------------------------------
-- 8) تحديث دالة الحفظ لتشمل الحقول الجديدة
-- ---------------------------------------------------------------------------
create or replace function submit_profile(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_type  profile_type;
  v_id    uuid;
  v_email text;
  v_phone text;
  v_item  text;
begin
  v_type  := (payload->>'profile_type')::profile_type;
  v_email := trim(payload->>'email');
  v_phone := trim(payload->>'phone');

  if v_email is null or v_email = '' then
    raise exception 'البريد الإلكتروني مطلوب' using errcode = 'P0001';
  end if;

  if check_profile_exists(v_email, v_phone, v_type) then
    raise exception 'DUPLICATE_PROFILE' using errcode = 'P0002';
  end if;

  insert into profiles (profile_type, full_name, email, phone, region, city,
                        bio, professional_headline, skills)
  values (
    v_type,
    trim(payload->>'full_name'),
    v_email,
    v_phone,
    trim(payload->>'region'),
    nullif(trim(coalesce(payload->>'city', '')), ''),
    nullif(trim(coalesce(payload->>'bio', '')), ''),
    nullif(trim(coalesce(payload->>'professional_headline', '')), ''),
    coalesce(
      (select array_agg(value)
       from jsonb_array_elements_text(coalesce(payload->'skills', '[]'::jsonb))),
      '{}'
    )
  )
  returning id into v_id;

  -- ---------------- الباحث عن فرصة ----------------
  if v_type = 'opportunity_seeker' then
    insert into opportunity_seeker_profiles (
      profile_id, current_status, specialization, education_level,
      target_job_title, years_of_experience,
      linkedin_url, personal_website_url, github_url, cv_path
    ) values (
      v_id,
      payload->>'current_status',
      payload->>'specialization',
      payload->>'education_level',
      payload->>'target_job_title',
      payload->>'years_of_experience',
      nullif(trim(coalesce(payload->>'linkedin_url', '')), ''),
      nullif(trim(coalesce(payload->>'personal_website_url', '')), ''),
      nullif(trim(coalesce(payload->>'github_url', '')), ''),
      payload->>'cv_path'
    );

    for v_item in
      select jsonb_array_elements_text(coalesce(payload->'opportunity_preferences', '[]'::jsonb))
    loop
      insert into opportunity_preferences (profile_id, preference_type)
      values (v_id, v_item) on conflict do nothing;
    end loop;

  -- ---------------- الخبير ----------------
  elsif v_type = 'expert' then
    insert into expert_profiles (
      profile_id, current_job_title, current_organization, employment_status,
      years_of_experience, education_level, specialization,
      delivery_mode, participation_mode,
      linkedin_url, personal_website_url, github_url, cv_path
    ) values (
      v_id,
      payload->>'current_job_title',
      payload->>'current_organization',
      nullif(trim(coalesce(payload->>'employment_status', '')), ''),
      payload->>'years_of_experience',
      payload->>'education_level',
      payload->>'specialization',
      coalesce(payload->>'participation_mode', 'both')::delivery_mode,
      coalesce(payload->>'participation_mode', 'both')::participation_mode,
      nullif(trim(coalesce(payload->>'linkedin_url', '')), ''),
      nullif(trim(coalesce(payload->>'personal_website_url', '')), ''),
      nullif(trim(coalesce(payload->>'github_url', '')), ''),
      payload->>'cv_path'
    );

    for v_item in
      select jsonb_array_elements_text(coalesce(payload->'contribution_types', '[]'::jsonb))
    loop
      insert into expert_contribution_types (profile_id, contribution_type)
      values (v_id, v_item) on conflict do nothing;
    end loop;

    for v_item in
      select jsonb_array_elements_text(coalesce(payload->'participation_types', '[]'::jsonb))
    loop
      insert into expert_participation_types (profile_id, participation_type)
      values (v_id, v_item) on conflict do nothing;
    end loop;

    for v_item in
      select jsonb_array_elements_text(coalesce(payload->'areas', '[]'::jsonb))
    loop
      insert into expert_areas (profile_id, area)
      values (v_id, v_item) on conflict do nothing;
    end loop;

    for v_item in
      select jsonb_array_elements_text(coalesce(payload->'target_audiences', '[]'::jsonb))
    loop
      insert into expert_target_audiences (profile_id, audience)
      values (v_id, v_item) on conflict do nothing;
    end loop;

  -- ---------------- المتطوع ----------------
  elsif v_type = 'volunteer' then
    insert into volunteer_profiles (
      profile_id, specialization, years_of_experience, has_volunteered,
      weekly_hours, availability_times, participation_mode,
      linkedin_url, github_url, personal_website_url, cv_path, what_can_offer
    ) values (
      v_id,
      nullif(trim(coalesce(payload->>'specialization', '')), ''),
      nullif(trim(coalesce(payload->>'years_of_experience', '')), ''),
      (payload->>'has_volunteered')::boolean,
      nullif(trim(coalesce(payload->>'weekly_hours', '')), ''),
      coalesce(
        (select array_agg(value)
         from jsonb_array_elements_text(coalesce(payload->'availability_times', '[]'::jsonb))),
        '{}'
      ),
      nullif(trim(coalesce(payload->>'participation_mode', '')), '')::participation_mode,
      nullif(trim(coalesce(payload->>'linkedin_url', '')), ''),
      nullif(trim(coalesce(payload->>'github_url', '')), ''),
      nullif(trim(coalesce(payload->>'personal_website_url', '')), ''),
      nullif(trim(coalesce(payload->>'cv_path', '')), ''),
      payload->>'what_can_offer'
    );

    for v_item in
      select jsonb_array_elements_text(coalesce(payload->'volunteer_types', '[]'::jsonb))
    loop
      insert into volunteer_types (profile_id, volunteer_type)
      values (v_id, v_item) on conflict do nothing;
    end loop;
  end if;

  return v_id;
end $fn$;

grant execute on function submit_profile(jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 9) عرض موحّد للوحة الإدارة (Talent Pool)
-- ---------------------------------------------------------------------------
drop view if exists talent_pool;
create view talent_pool
with (security_invoker = true) as
select
  p.id, p.profile_type, p.full_name, p.email, p.phone, p.region,
  p.skills, p.internal_status, p.status_note, p.bio, p.created_at,
  coalesce(s.specialization, e.specialization, v.specialization) as specialization,
  coalesce(s.education_level, e.education_level)                 as education_level,
  coalesce(s.years_of_experience, e.years_of_experience, v.years_of_experience)
                                                                 as years_of_experience,
  s.target_job_title,
  s.current_status,
  e.current_job_title,
  e.current_organization,
  coalesce(e.participation_mode, v.participation_mode)           as participation_mode,
  v.weekly_hours, v.has_volunteered, v.what_can_offer, v.availability_times,
  coalesce(s.cv_path, e.cv_path, v.cv_path)                      as cv_path,
  coalesce(s.linkedin_url, e.linkedin_url, v.linkedin_url)       as linkedin_url,
  coalesce(s.github_url, v.github_url)                           as github_url,
  coalesce(s.personal_website_url, e.personal_website_url, v.personal_website_url)
                                                                 as personal_website_url,
  (select array_agg(preference_type) from opportunity_preferences o where o.profile_id = p.id)
                                                                 as opportunity_types,
  (select array_agg(contribution_type) from expert_contribution_types c where c.profile_id = p.id)
                                                                 as contribution_types,
  (select array_agg(volunteer_type) from volunteer_types t where t.profile_id = p.id)
                                                                 as volunteer_type_list
from profiles p
left join opportunity_seeker_profiles s on s.profile_id = p.id
left join expert_profiles            e on e.profile_id = p.id
left join volunteer_profiles         v on v.profile_id = p.id;

grant select on talent_pool to authenticated;

-- ---------------------------------------------------------------------------
-- 10) قراءة السير الذاتية للإدارة فقط
-- ---------------------------------------------------------------------------
drop policy if exists "cvs_admin_read" on storage.objects;
create policy "cvs_admin_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'cvs' and public.is_admin());

-- ============================================================================
-- تم.
--
-- لإنشاء أول حساب مسؤول:
--   1) Supabase → Authentication → Users → Add user  (بريد + كلمة مرور)
--   2) نفّذ هذا الاستعلام مستبدلاً البريد:
--
--      insert into admin_users (id, email, full_name)
--      select id, email, 'اسم المسؤول' from auth.users
--      where email = 'YOUR_ADMIN_EMAIL';
-- ============================================================================
