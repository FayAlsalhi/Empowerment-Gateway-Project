-- ============================================================================
-- بوابة التمكين | Empowerment Portal
-- المخطط الكامل — نفّذ هذا الملف مرة واحدة في: Supabase → SQL Editor → Run
--
-- ملاحظة أمنية مهمة:
--   لا يوجد تسجيل دخول. الجداول مقفلة تماماً (RLS مفعّل بدون أي سياسة)،
--   فلا يستطيع أحد القراءة أو الكتابة مباشرة من الواجهة.
--   كل العمليات تمر عبر دالتي RPC بصلاحية SECURITY DEFINER:
--     • check_profile_exists() — تفحص التكرار وترجع true/false فقط
--     • submit_profile()      — تحفظ الملف كاملاً في معاملة واحدة
--   بهذا يستطيع الزائر الإرسال دون أن يقرأ بيانات أي شخص آخر.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0) تنظيف المخطط القديم (منصة الوظائف السابقة)
-- ---------------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;

drop table if exists
  application_status_history, applications, opportunity_skills, opportunities,
  saved_opportunities, notifications, user_talent_tags, talent_tags, admin_notes,
  activity_logs, organization_members, organizations, certificates, availability,
  education, experiences, user_skills, user_categories, skills, categories,
  user_roles, expert_profiles, volunteer_profiles, job_seeker_profiles, profiles
cascade;

drop function if exists has_role(role_name) cascade;
drop function if exists is_staff() cascade;
drop function if exists is_super_admin() cascade;
drop function if exists handle_new_user() cascade;
drop function if exists log_application_status() cascade;
drop function if exists set_updated_at() cascade;

drop type if exists role_name, employment_status, opportunity_type, opportunity_status,
  work_mode, application_status, availability_status, volunteer_kind, notification_type cascade;

-- حذف الحسابات التجريبية القديمة (لم تعد هناك حاجة للمصادقة)
delete from auth.users where email like '%@tamkeen.sa';

-- إزالة سياسات التخزين القديمة
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'storage' and tablename = 'objects'
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end $$;

-- ملاحظة: لا يمكن حذف الحاويات عبر SQL (يمنعها Supabase بـ storage.protect_delete).
-- الحاويات القديمة (avatars, organization-logos, certificates, portfolio-files)
-- أصبحت بلا سياسات بعد حذف السياسات أعلاه، فهي مغلقة تماماً وغير ضارة.
-- لحذفها نهائياً: Supabase Dashboard → Storage → اختر الحاوية → Delete bucket.

-- ---------------------------------------------------------------------------
-- 1) الأنواع
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

create type profile_type   as enum ('opportunity_seeker', 'expert', 'volunteer');
create type volunteer_type as enum ('specialized', 'operational', 'both');
create type delivery_mode  as enum ('onsite', 'remote', 'both');
create type work_mode      as enum ('onsite', 'remote', 'hybrid', 'no_preference');

-- ---------------------------------------------------------------------------
-- 2) دالة updated_at
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- 3) الجدول الرئيسي
-- ---------------------------------------------------------------------------
create table profiles (
  id                    uuid primary key default gen_random_uuid(),
  profile_type          profile_type not null,
  full_name             text not null,
  email                 text not null,
  phone                 text not null,
  city                  text not null,
  region                text not null,
  bio                   text,
  professional_headline text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  -- نفس الشخص يمكن أن يسجل في أكثر من مسار، لكن لا يكرر نفس المسار
  constraint profiles_email_type_unique unique (email, profile_type)
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

create index idx_profiles_type  on profiles(profile_type);
create index idx_profiles_email on profiles(lower(email));
create index idx_profiles_phone on profiles(phone);

-- ---------------------------------------------------------------------------
-- 4) مسار «أبحث عن فرصة»
-- ---------------------------------------------------------------------------
create table opportunity_seeker_profiles (
  id                   uuid primary key default gen_random_uuid(),
  profile_id           uuid not null unique references profiles(id) on delete cascade,
  current_status       text not null,
  preferred_work_mode  work_mode not null,
  linkedin_url         text not null,
  portfolio_url        text,
  personal_website_url text,
  github_url           text,
  cv_path              text not null,
  created_at           timestamptz not null default now()
);

create table opportunity_preferences (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  preference_type text not null,
  unique (profile_id, preference_type)
);
create index idx_opp_pref_profile on opportunity_preferences(profile_id);

-- ---------------------------------------------------------------------------
-- 5) مسار «أساهم بخبرتي»
-- ---------------------------------------------------------------------------
create table expert_profiles (
  id                   uuid primary key default gen_random_uuid(),
  profile_id           uuid not null unique references profiles(id) on delete cascade,
  current_job_title    text not null,
  current_organization text,
  employment_status    text not null,
  years_of_experience  text not null,
  education_level      text not null,
  specialization       text not null,
  delivery_mode        delivery_mode not null,
  linkedin_url         text not null,
  portfolio_url        text,
  personal_website_url text,
  github_url           text,
  cv_path              text not null,
  created_at           timestamptz not null default now()
);

create table expert_participation_types (
  id                 uuid primary key default gen_random_uuid(),
  profile_id         uuid not null references profiles(id) on delete cascade,
  participation_type text not null,
  unique (profile_id, participation_type)
);
create index idx_exp_part_profile on expert_participation_types(profile_id);

create table expert_areas (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  area       text not null,
  unique (profile_id, area)
);
create index idx_exp_area_profile on expert_areas(profile_id);

create table expert_target_audiences (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  audience   text not null,
  unique (profile_id, audience)
);
create index idx_exp_aud_profile on expert_target_audiences(profile_id);

-- نوع المساهمة (تدريب / إرشاد / استشارات ...)
create table expert_contribution_types (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references profiles(id) on delete cascade,
  contribution_type text not null,
  unique (profile_id, contribution_type)
);
create index idx_exp_contrib_profile on expert_contribution_types(profile_id);

-- ---------------------------------------------------------------------------
-- 6) مسار «أتطوع»
-- ---------------------------------------------------------------------------
create table volunteer_profiles (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null unique references profiles(id) on delete cascade,
  volunteer_type volunteer_type not null,
  created_at     timestamptz not null default now()
);

create table volunteer_interests (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  interest   text not null,
  unique (profile_id, interest)
);
create index idx_vol_interest_profile on volunteer_interests(profile_id);

-- ---------------------------------------------------------------------------
-- 7) الحماية: RLS مفعّل بدون أي سياسة  ⇒  لا وصول مباشر إطلاقاً
-- ---------------------------------------------------------------------------
alter table profiles                    enable row level security;
alter table opportunity_seeker_profiles enable row level security;
alter table opportunity_preferences     enable row level security;
alter table expert_profiles             enable row level security;
alter table expert_participation_types  enable row level security;
alter table expert_areas                enable row level security;
alter table expert_target_audiences     enable row level security;
alter table expert_contribution_types   enable row level security;
alter table volunteer_profiles          enable row level security;
alter table volunteer_interests         enable row level security;

-- سحب أي صلاحية مباشرة من أدوار الواجهة
revoke all on all tables in schema public from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 8) RPC: فحص التكرار — يرجع boolean فقط، لا يسرّب أي بيانات
-- ---------------------------------------------------------------------------
create or replace function check_profile_exists(
  p_email text,
  p_phone text,
  p_type  profile_type
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where profile_type = p_type
      and (lower(email) = lower(trim(p_email)) or phone = trim(p_phone))
  );
$$;

-- ---------------------------------------------------------------------------
-- 9) RPC: حفظ الملف كاملاً في معاملة واحدة
--    يستقبل JSON واحد ويوزّعه على الجداول حسب نوع المسار.
-- ---------------------------------------------------------------------------
create or replace function submit_profile(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_type    profile_type;
  v_id      uuid;
  v_email   text;
  v_phone   text;
  v_item    text;
begin
  v_type  := (payload->>'profile_type')::profile_type;
  v_email := trim(payload->>'email');
  v_phone := trim(payload->>'phone');

  if v_email is null or v_email = '' then
    raise exception 'البريد الإلكتروني مطلوب' using errcode = 'P0001';
  end if;

  -- منع التكرار داخل نفس المسار (مسموح التسجيل في مسار آخر بنفس البريد)
  if check_profile_exists(v_email, v_phone, v_type) then
    raise exception 'DUPLICATE_PROFILE' using errcode = 'P0002';
  end if;

  insert into profiles (profile_type, full_name, email, phone, city, region,
                        bio, professional_headline)
  values (
    v_type,
    trim(payload->>'full_name'),
    v_email,
    v_phone,
    trim(payload->>'city'),
    trim(payload->>'region'),
    nullif(trim(coalesce(payload->>'bio', '')), ''),
    nullif(trim(coalesce(payload->>'professional_headline', '')), '')
  )
  returning id into v_id;

  -- ---------------- مسار الباحث عن فرصة ----------------
  if v_type = 'opportunity_seeker' then
    insert into opportunity_seeker_profiles (
      profile_id, current_status, preferred_work_mode, linkedin_url,
      portfolio_url, personal_website_url, github_url, cv_path
    ) values (
      v_id,
      payload->>'current_status',
      (payload->>'preferred_work_mode')::work_mode,
      payload->>'linkedin_url',
      nullif(trim(coalesce(payload->>'portfolio_url', '')), ''),
      nullif(trim(coalesce(payload->>'personal_website_url', '')), ''),
      nullif(trim(coalesce(payload->>'github_url', '')), ''),
      payload->>'cv_path'
    );

    for v_item in select jsonb_array_elements_text(coalesce(payload->'opportunity_preferences', '[]'::jsonb))
    loop
      insert into opportunity_preferences (profile_id, preference_type)
      values (v_id, v_item) on conflict do nothing;
    end loop;

  -- ---------------- مسار الخبير ----------------
  elsif v_type = 'expert' then
    insert into expert_profiles (
      profile_id, current_job_title, current_organization, employment_status,
      years_of_experience, education_level, specialization, delivery_mode,
      linkedin_url, portfolio_url, personal_website_url, github_url, cv_path
    ) values (
      v_id,
      payload->>'current_job_title',
      nullif(trim(coalesce(payload->>'current_organization', '')), ''),
      payload->>'employment_status',
      payload->>'years_of_experience',
      payload->>'education_level',
      payload->>'specialization',
      (payload->>'delivery_mode')::delivery_mode,
      payload->>'linkedin_url',
      nullif(trim(coalesce(payload->>'portfolio_url', '')), ''),
      nullif(trim(coalesce(payload->>'personal_website_url', '')), ''),
      nullif(trim(coalesce(payload->>'github_url', '')), ''),
      payload->>'cv_path'
    );

    for v_item in select jsonb_array_elements_text(coalesce(payload->'participation_types', '[]'::jsonb))
    loop
      insert into expert_participation_types (profile_id, participation_type)
      values (v_id, v_item) on conflict do nothing;
    end loop;

    for v_item in select jsonb_array_elements_text(coalesce(payload->'areas', '[]'::jsonb))
    loop
      insert into expert_areas (profile_id, area)
      values (v_id, v_item) on conflict do nothing;
    end loop;

    for v_item in select jsonb_array_elements_text(coalesce(payload->'contribution_types', '[]'::jsonb))
    loop
      insert into expert_contribution_types (profile_id, contribution_type)
      values (v_id, v_item) on conflict do nothing;
    end loop;

    for v_item in select jsonb_array_elements_text(coalesce(payload->'target_audiences', '[]'::jsonb))
    loop
      insert into expert_target_audiences (profile_id, audience)
      values (v_id, v_item) on conflict do nothing;
    end loop;

  -- ---------------- مسار المتطوع ----------------
  elsif v_type = 'volunteer' then
    insert into volunteer_profiles (profile_id, volunteer_type)
    values (v_id, (payload->>'volunteer_type')::volunteer_type);

    for v_item in select jsonb_array_elements_text(coalesce(payload->'interests', '[]'::jsonb))
    loop
      insert into volunteer_interests (profile_id, interest)
      values (v_id, v_item) on conflict do nothing;
    end loop;
  end if;

  return v_id;
end $$;

-- منح صلاحية التنفيذ للزوار (وهي الطريقة الوحيدة للكتابة)
grant execute on function check_profile_exists(text, text, profile_type) to anon, authenticated;
grant execute on function submit_profile(jsonb)                          to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 10) التخزين: حاوية خاصة للسير الذاتية — رفع فقط، بدون قراءة
-- ---------------------------------------------------------------------------
-- إنشاء/تحديث الحاوية داخل بلوك محمي، فبعض إصدارات Supabase تقيّد التعديل المباشر
do $$
begin
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'cvs', 'cvs', false, 5242880,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  )
  on conflict (id) do update
    set public = false,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;
exception when others then
  raise notice 'تعذّر ضبط حاوية cvs تلقائياً (%). أنشئها يدوياً من Storage واجعلها Private.', sqlerrm;
end $$;

-- الزائر يستطيع الرفع فقط. لا سياسة SELECT ⇒ لا أحد يقرأ السير من الواجهة.
-- فريق الإدارة يصل للملفات من لوحة تحكم Supabase.
drop policy if exists "cvs_anon_upload" on storage.objects;
create policy "cvs_anon_upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'cvs');

-- ============================================================================
-- تم. الجداول مقفلة، والكتابة تتم حصراً عبر submit_profile().
-- ============================================================================
