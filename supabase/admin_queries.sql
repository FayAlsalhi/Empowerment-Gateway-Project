-- ============================================================================
-- بوابة التمكين — استعلامات جاهزة لفريق الإدارة
-- نفّذها في: Supabase → SQL Editor
-- ============================================================================

-- 1) كل المسجّلين مع مسار السيرة الذاتية
select
  p.created_at                          as "التاريخ",
  case p.profile_type
    when 'opportunity_seeker' then 'باحث عن فرصة'
    when 'expert'             then 'خبير'
    when 'volunteer'          then 'متطوع'
  end                                   as "المسار",
  p.full_name                           as "الاسم",
  p.email                               as "البريد",
  p.phone                               as "الجوال",
  p.city                                as "المدينة",
  p.region                              as "المنطقة",
  coalesce(s.cv_path, e.cv_path)        as "مسار السيرة الذاتية"
from profiles p
left join opportunity_seeker_profiles s on s.profile_id = p.id
left join expert_profiles            e on e.profile_id = p.id
order by p.created_at desc;


-- 2) الباحثون عن فرصة — بالتفصيل مع تفضيلاتهم
select
  p.full_name                     as "الاسم",
  p.email                         as "البريد",
  p.professional_headline         as "العنوان المهني",
  s.current_status                as "الحالة",
  s.preferred_work_mode           as "نمط العمل",
  string_agg(op.preference_type, ' · ') as "الفرص المطلوبة",
  s.linkedin_url                  as "LinkedIn",
  s.cv_path                       as "السيرة الذاتية"
from profiles p
join opportunity_seeker_profiles s on s.profile_id = p.id
left join opportunity_preferences op on op.profile_id = p.id
where p.profile_type = 'opportunity_seeker'
group by p.id, s.id
order by p.created_at desc;


-- 3) الخبراء — بالتفصيل
select
  p.full_name                                as "الاسم",
  p.email                                    as "البريد",
  e.current_job_title                        as "المسمى",
  e.current_organization                     as "الجهة",
  e.years_of_experience                      as "الخبرة",
  e.education_level                          as "المؤهل",
  e.specialization                           as "التخصص",
  e.delivery_mode                            as "طريقة المشاركة",
  (select string_agg(participation_type, ' · ')
     from expert_participation_types t where t.profile_id = p.id) as "نوع المشاركة",
  (select string_agg(area, ' · ')
     from expert_areas a where a.profile_id = p.id)               as "المجالات",
  (select string_agg(audience, ' · ')
     from expert_target_audiences x where x.profile_id = p.id)    as "الفئات المستهدفة",
  e.cv_path                                  as "السيرة الذاتية"
from profiles p
join expert_profiles e on e.profile_id = p.id
order by p.created_at desc;


-- 4) المتطوعون — بالتفصيل
select
  p.full_name                          as "الاسم",
  p.email                              as "البريد",
  p.phone                              as "الجوال",
  p.city                               as "المدينة",
  v.volunteer_type                     as "نوع التطوع",
  string_agg(vi.interest, ' · ')       as "المجالات"
from profiles p
join volunteer_profiles v on v.profile_id = p.id
left join volunteer_interests vi on vi.profile_id = p.id
where p.profile_type = 'volunteer'
group by p.id, v.id
order by p.created_at desc;


-- 5) إحصائية سريعة
select
  case profile_type
    when 'opportunity_seeker' then 'باحث عن فرصة'
    when 'expert'             then 'خبير'
    when 'volunteer'          then 'متطوع'
  end            as "المسار",
  count(*)       as "العدد"
from profiles
group by profile_type
order by count(*) desc;


-- 6) رابط مؤقت لتحميل سيرة ذاتية (صالح ساعة واحدة)
--    استبدل المسار بقيمة cv_path من الاستعلامات أعلاه.
--    يتطلب امتداد pg_net أو استخدم واجهة Storage مباشرة — الأسهل:
--    Storage → cvs → افتح المجلد المطابق → اضغط الملف → Download.
