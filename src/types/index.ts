// ===== أنواع تطابق مخطط Postgres =====

export type ProfileType = 'opportunity_seeker' | 'expert' | 'volunteer';

export type VolunteerType = 'specialized' | 'operational' | 'both';

export type DeliveryMode = 'onsite' | 'remote' | 'both';

export type WorkMode = 'onsite' | 'remote' | 'hybrid' | 'no_preference';

// ===== الحقول المشتركة بين كل المسارات =====
export interface BasePersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  bio?: string;
  professional_headline?: string;
}

// ===== مسار: أبحث عن فرصة =====
export interface OpportunitySeekerPayload extends BasePersonalInfo {
  profile_type: 'opportunity_seeker';
  bio: string;
  professional_headline: string;
  current_status: string;
  opportunity_preferences: string[];
  preferred_work_mode: WorkMode;
  linkedin_url: string;
  portfolio_url?: string;
  personal_website_url?: string;
  github_url?: string;
  cv_path: string;
}

// ===== مسار: أساهم بخبرتي =====
export interface ExpertPayload extends BasePersonalInfo {
  profile_type: 'expert';
  bio: string;
  professional_headline: string;
  current_job_title: string;
  current_organization?: string;
  employment_status: string;
  years_of_experience: string;
  education_level: string;
  specialization: string;
  participation_types: string[];
  areas: string[];
  contribution_types: string[];
  target_audiences: string[];
  delivery_mode: DeliveryMode;
  linkedin_url: string;
  portfolio_url?: string;
  personal_website_url?: string;
  github_url?: string;
  cv_path: string;
}

// ===== مسار: أتطوع =====
export interface VolunteerPayload extends BasePersonalInfo {
  profile_type: 'volunteer';
  volunteer_type: VolunteerType;
  interests: string[];
}

export type SubmissionPayload =
  | OpportunitySeekerPayload
  | ExpertPayload
  | VolunteerPayload;

/** خيار موحّد لمكوّنات الاختيار. */
export interface Option {
  value: string;
  label: string;
}
