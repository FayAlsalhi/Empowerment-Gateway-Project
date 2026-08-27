-- ============================================================================
-- جمعية القصيم التقنية — ترحيل 003
-- السماح بالتسجيل المتكرر بنفس البريد (للاختبار وللاستخدام الفعلي)
-- نفّذه في: Supabase → SQL Editor → Run
-- ============================================================================

-- 1) إزالة القيد الذي كان يمنع تكرار البريد داخل نفس المسار
alter table profiles drop constraint if exists profiles_email_type_unique;

-- 2) إعادة تعريف دالة الحفظ بدون أي فحص للتكرار
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

  -- لا يوجد فحص تكرار: كل إرسال ينشئ سجلاً جديداً مستقلاً

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

-- 3) دالة فحص التكرار لم تعد مستخدمة
drop function if exists check_profile_exists(text, text, profile_type);

-- ============================================================================
-- تم. الآن يمكن التسجيل بنفس البريد أكثر من مرة في نفس المسار،
-- وكل تسجيل يظهر كسجل مستقل في لوحة الإدارة.
-- ============================================================================
