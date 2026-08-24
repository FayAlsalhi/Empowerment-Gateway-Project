# بوابة التمكين | Empowerment Portal

بوابة تسجيل بسيطة وسريعة تجمع بيانات المهتمين بالفرص، والخبراء، والمتطوعين — بتجربة استخدام تشبه موقعاً احترافياً، لا نموذجاً تقليدياً.

**بدون تسجيل دخول.** الزائر يدخل مباشرة، يختار مساره، يعبّئ بياناته على خطوات، ثم يُرسل.

## المسارات الثلاثة

| المسار | الخطوات | المخرجات |
|---|---|---|
| **أبحث عن فرصة** | معلوماتك ← ما الذي تبحث عنه؟ ← روابطك وملفاتك ← مراجعة | ملف + تفضيلات + سيرة ذاتية |
| **أساهم بخبرتي** | معلوماتك ← معلوماتك المهنية ← كيف ترغب بالمساهمة؟ ← روابطك وملفاتك ← مراجعة | ملف خبير + مجالات + فئات مستهدفة |
| **أتطوع** | معلوماتك ← نوع التطوع ومجالاته | ملف متطوع (الأبسط — بدون سيرة ذاتية) |

## التقنيات

React 18 · TypeScript (strict) · Vite · Tailwind CSS · Radix (بنمط shadcn/ui) · Framer Motion · React Hook Form · Zod · Supabase (PostgreSQL + Storage)

---

## التشغيل

```bash
npm install
```

انسخ `.env.example` إلى `.env` واملأ القيم من Supabase (`Project Settings → API`):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

ثم نفّذ `supabase/schema.sql` مرة واحدة في **Supabase → SQL Editor → Run**.

> ⚠️ الملف يحذف مخطط منصة الوظائف السابق بالكامل قبل إنشاء المخطط الجديد.

```bash
npm run dev
```

---

## نموذج الحماية 🔒

هذه أهم نقطة معمارية في المشروع. لا يوجد تسجيل دخول، ومع ذلك **لا يستطيع أي زائر قراءة بيانات أي شخص آخر**.

الجداول كلها مفعّل عليها RLS **بدون أي سياسة** — أي لا وصول مباشر إطلاقاً، لا قراءة ولا كتابة. كل العمليات تمر عبر دالتين في Postgres بصلاحية `SECURITY DEFINER`:

| الدالة | الوظيفة | ما تكشفه |
|---|---|---|
| `check_profile_exists(email, phone, type)` | فحص التكرار | `true` / `false` فقط |
| `submit_profile(payload jsonb)` | حفظ الملف كاملاً في معاملة واحدة | معرّف الملف الجديد |

بهذا نحقق متطلبين متعارضين ظاهرياً: منع التكرار (يحتاج قراءة) مع إغلاق القراءة تماماً عن الواجهة.

السير الذاتية تُرفع إلى حاوية `cvs` **غير عامة**، وسياسة التخزين تسمح بالرفع فقط دون قراءة — فريق الإدارة يصل إليها من لوحة تحكم Supabase.

> لا يوجد `service_role key` في الواجهة الأمامية إطلاقاً.

---

## قاعدة البيانات

```
profiles  (الجدول الرئيسي — profile_type يحدد المسار)
├── opportunity_seeker_profiles  +  opportunity_preferences
├── expert_profiles  +  expert_participation_types
│                    +  expert_areas
│                    +  expert_contribution_types
│                    +  expert_target_audiences
└── volunteer_profiles  +  volunteer_interests
```

**تعدد المسارات:** القيد `unique (email, profile_type)` يمنع تكرار التسجيل في نفس المسار، لكنه يسمح لنفس الشخص بالتسجيل كباحث عن فرصة *و* خبير *و* متطوع بنفس البريد.

الوصول للبيانات حالياً من **Supabase Dashboard** مباشرة. المخطط مصمّم ليسمح ببناء لوحة إدارة منفصلة لاحقاً دون تغيير جذري.

---

## البنية

```
src/
├── components/
│   ├── ui/          مكوّنات أساسية
│   ├── form/        StepIndicator, FormField, OptionCards,
│   │                MultiSelectChips, CvUpload, ReviewSection
│   ├── SplashScreen.tsx · SuccessScreen.tsx · FlowShell.tsx
│   └── common/states.tsx
├── flows/
│   ├── opportunity-seeker/
│   ├── expert/
│   └── volunteer/
├── pages/           HomePage, NotFoundPage
├── lib/             supabase, submissions, constants, utils
├── schemas/         مخططات Zod (رسائل عربية)
└── types/

supabase/schema.sql  المخطط الكامل + الدوال الآمنة + التخزين
```

---

## النشر

**Vercel:** استورد المستودع، أضف متغيّري البيئة، وانشر — `vercel.json` يتكفّل بتوجيه مسارات الـSPA.

**Supabase:** لا يحتاج إعداد مصادقة (لا يوجد تسجيل دخول).

## أوامر

```bash
npm run dev        # التطوير
npm run build      # بناء الإنتاج
npm run typecheck  # فحص الأنواع
```
