import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client. Reads keys from .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
 * If keys are missing the client is null and the portal shows a "not configured"
 * notice instead of crashing the rest of the website.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);

/** Login IDs are mapped to a synthetic email for Supabase Auth. */
export const LOGIN_EMAIL_DOMAIN = 'vidyaneuron.local';

export function loginIdToEmail(loginId: string) {
  return `${loginId.trim().toLowerCase()}@${LOGIN_EMAIL_DOMAIN}`;
}

export type UserRole = 'admin' | 'teacher' | 'student';

export interface Profile {
  id: string;
  login_id: string;
  full_name: string;
  role: UserRole;
  valid_until: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  teacher_id: string;
  teacher_name: string;
  title: string;
  description: string | null;
  link_url: string | null;
  file_path: string | null;
  file_name: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  author_id: string;
  author_name: string;
  audience: 'all' | 'students' | 'teachers';
  title: string;
  body: string | null;
  created_at: string;
}

export interface Assignment {
  id: string;
  teacher_id: string;
  teacher_name: string;
  title: string;
  description: string | null;
  file_path: string | null;
  file_name: string | null;
  due_date: string | null;
  created_at: string;
}

export interface TimetableEntry {
  id: string;
  day: string;
  time_slot: string;
  subject: string;
  teacher_name: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  category: string;
  caption: string | null;
  created_at: string;
}

export interface Fees {
  student_id: string;
  total_amount: number;
  paid_amount: number;
  next_due_date: string | null;
  note: string | null;
  updated_at: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  course: string | null;
  story: string;
  image_url: string | null;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  mobile: string | null;
  email: string | null;
  course: string | null;
  message: string | null;
  created_at: string;
}
