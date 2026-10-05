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
  /** When true the notice is also shown on the public website. Admin only. */
  is_public: boolean;
  /** Pinned notices sort above the rest. */
  pinned: boolean;
  /** Optional attachment (image / PDF / any file) in the public `gallery` bucket. */
  file_url: string | null;
  file_name: string | null;
  file_type: 'image' | 'file' | null;
  /** Optional external link shown as a button on the notice. */
  link_url: string | null;
  /** Notice disappears from the website after this date. */
  expires_at: string | null;
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

export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type PaymentMethod = 'upi' | 'cash' | 'bank';

/** One fee payment submitted by a student (or recorded at the counter by the admin). */
export interface FeePayment {
  id: string;
  student_id: string;
  student_name: string;
  login_id: string | null;
  course: string | null;
  amount: number;
  method: PaymentMethod;
  /** UPI UTR / transaction reference entered by the student. */
  reference_no: string | null;
  /** Path inside the private `payments` bucket - opened through a signed URL. */
  screenshot_path: string | null;
  note: string | null;
  status: PaymentStatus;
  /** Issued only when an admin verifies the payment, e.g. VES/2026/0001. */
  receipt_no: string | null;
  paid_on: string | null;
  verified_by: string | null;
  verified_by_name: string | null;
  verified_at: string | null;
  reject_reason: string | null;
  created_at: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  course: string | null;
  story: string;
  image_url: string | null;
  created_at: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/** A star rating written by a logged-in student (see SUPABASE_SETUP_PART7.md). */
export interface Review {
  id: string;
  /** null when the review came from a website visitor rather than a logged-in student. */
  student_id: string | null;
  student_name: string;
  login_id: string | null;
  /** Phone or email a website visitor left, so the office can check who wrote it. */
  contact: string | null;
  /** null means the overall institute rating; otherwise a course slug. */
  course_slug: string | null;
  course_title: string | null;
  rating: number;
  review: string | null;
  status: ReviewStatus;
  /** Featured reviews are shown first in the Home page ratings section. */
  featured: boolean;
  approved_by_name: string | null;
  approved_at: string | null;
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
