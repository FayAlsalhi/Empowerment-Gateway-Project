// ===== أنواع تطابق مخطط Postgres =====

export type ProfileType = 'opportunity_seeker' | 'expert' | 'volunteer';

export type ParticipationMode = 'onsite' | 'remote' | 'both';

export type InternalStatus =
  | 'new'
  | 'reviewed'
  | 'shortlisted'
  | 'contacted'
  | 'matched'
  | 'archived';

/** خيار موحّد لمكوّنات الاختيار. */
export interface Option {
  value: string;
  label: string;
}

// ===== حقول مشتركة =====
export interface BaseInfo {
  full_name: string;
  email: string;
  phone: string;
  region: string;
  /** نبذة عن الشخص — تُحفظ في profiles.bio وتظهر في لوحة الإدارة */
  bio: string;
  skills: string[];
}

// ===== مسار: أبحث عن فرصة =====
export interface SeekerPayload extends BaseInfo {
  profile_type: 'opportunity_seeker';
  current_status: string;
  specialization: string;
  education_level: string;
  target_job_title: string;
  years_of_experience: string;
  opportunity_preferences: string[];
  cv_path: string;
  linkedin_url: string;
  github_url?: string;
  personal_website_url?: string;
}

// ===== مسار: خبير / مستشار =====
export interface ExpertPayload extends BaseInfo {
  profile_type: 'expert';
  contribution_types: string[];
  specialization: string;
  current_job_title: string;
  current_organization: string;
  years_of_experience: string;
  education_level: string;
  participation_mode: ParticipationMode;
  cv_path: string;
  linkedin_url: string;
  personal_website_url?: string;
}

// ===== مسار: التطوع =====
export interface VolunteerPayload extends BaseInfo {
  profile_type: 'volunteer';
  volunteer_types: string[];
  specialization?: string;
  years_of_experience?: string;
  has_volunteered?: boolean;
  weekly_hours?: string;
  availability_times: string[];
  participation_mode?: ParticipationMode;
  what_can_offer: string;
  /** LinkedIn إجباري في كل المسارات */
  linkedin_url: string;
  /** السيرة الذاتية اختيارية في مسار التطوع فقط */
  cv_path?: string;
  github_url?: string;
  personal_website_url?: string;
}

export type SubmissionPayload = SeekerPayload | ExpertPayload | VolunteerPayload;

// ===== لوحة الإدارة: صف من عرض talent_pool =====
export interface TalentRow {
  id: string;
  profile_type: ProfileType;
  full_name: string;
  email: string;
  phone: string;
  region: string;
  skills: string[];
  internal_status: InternalStatus;
  status_note: string | null;
  bio: string | null;
  created_at: string;
  specialization: string | null;
  education_level: string | null;
  years_of_experience: string | null;
  target_job_title: string | null;
  current_status: string | null;
  current_job_title: string | null;
  current_organization: string | null;
  participation_mode: ParticipationMode | null;
  weekly_hours: string | null;
  has_volunteered: boolean | null;
  what_can_offer: string | null;
  availability_times: string[] | null;
  cv_path: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  personal_website_url: string | null;
  opportunity_types: string[] | null;
  contribution_types: string[] | null;
  volunteer_type_list: string[] | null;
}

export interface TalentFilters {
  search?: string;
  region?: string;
  currentStatus?: string;
  specialization?: string;
  opportunityType?: string;
  yearsOfExperience?: string;
  targetJobTitle?: string;
  skills?: string[];
  internalStatus?: InternalStatus;
}

export interface SectionStats {
  total: number;
  thisMonth: number;
  shortlisted: number;
  contacted: number;
}
