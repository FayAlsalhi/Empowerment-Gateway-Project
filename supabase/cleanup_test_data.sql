-- ============================================================================
-- بوابة جمعية القصيم التقنية — تنظيف البيانات التجريبية
--
-- نفّذ كل قسم على حدة في: Supabase → SQL Editor
-- ابدأ بالقسم (1) للمعاينة قبل أي حذف.
-- ============================================================================


-- ===========================================================================
-- (1) معاينة: ماذا يوجد الآن؟  — نفّذ هذا أولاً
-- ===========================================================================
select
  case profile_type
    when 'opportunity_seeker' then 'باحث عن فرصة'
    when 'expert'             then 'خبير'
    when 'volunteer'          then 'متطوع'
  end                       as "المسار",
  count(*)                  as "العدد",
  min(created_at)::date     as "أول تسجيل",
  max(created_at)::date     as "آخر تسجيل"
from profiles
group by profile_type
order by count(*) desc;


-- عرض السجلات لتمييز التجريبي من الحقيقي
select
  created_at::timestamp(0) as "التاريخ",
  profile_type             as "المسار",
  full_name                as "الاسم",
  email                    as "البريد",
  phone                    as "الجوال"
from profiles
order by created_at desc;


-- ===========================================================================
-- (2) الخيار الأول: حذف السجلات التجريبية فقط  ← الأنسب
-- ===========================================================================
-- عدّل الشرط ليطابق بياناتك التجريبية قبل التنفيذ.

-- معاينة ما سيُحذف (نفّذها أولاً وتأكد من النتيجة):
select full_name, email, created_at::timestamp(0)
from profiles
where email like '%@test.sa'
   or email like '%test%'
   or full_name like 'اختبار%'
   or full_name like '%التصميم%';

-- الحذف الفعلي (نفّذه بعد التأكد من المعاينة أعلاه):
-- delete from profiles
-- where email like '%@test.sa'
--    or email like '%test%'
--    or full_name like 'اختبار%'
--    or full_name like '%التصميم%';


-- ===========================================================================
-- (3) الخيار الثاني: حذف كل شيء والبدء من صفر
-- ===========================================================================
-- ⚠️ لا رجعة بعد التنفيذ. استخدمه فقط إن كانت كل البيانات تجريبية.

-- delete from profiles;


-- ===========================================================================
-- (4) التحقق بعد الحذف
-- ===========================================================================
-- الجداول الفرعية تُحذف تلقائياً مع الملف (ON DELETE CASCADE).
-- يجب أن تكون كل الأعداد صفراً إن حذفت كل شيء:

select 'profiles'                     as "الجدول", count(*) from profiles
union all select 'opportunity_seeker_profiles', count(*) from opportunity_seeker_profiles
union all select 'opportunity_preferences',     count(*) from opportunity_preferences
union all select 'expert_profiles',             count(*) from expert_profiles
union all select 'expert_contribution_types',   count(*) from expert_contribution_types
union all select 'expert_areas',                count(*) from expert_areas
union all select 'expert_target_audiences',     count(*) from expert_target_audiences
union all select 'volunteer_profiles',          count(*) from volunteer_profiles
union all select 'volunteer_types',             count(*) from volunteer_types
union all select 'volunteer_interests',         count(*) from volunteer_interests;
