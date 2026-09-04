import { supabase, type Announcement } from './supabase';

/** Bucket + folder that public notice attachments live in. */
export const NOTICE_BUCKET = 'gallery';
export const NOTICE_FOLDER = 'announcements';

/**
 * Public notices for the website: only the ones the admin marked public and that
 * have not passed their "hide after" date. Pinned notices come first.
 * Returns an empty list when Supabase is not configured, so the website never breaks.
 */
export async function fetchPublicAnnouncements(limit?: number): Promise<Announcement[]> {
  if (!supabase) return [];
  const today = new Date().toISOString().slice(0, 10);
  let query = supabase
    .from('announcements')
    .select('*')
    .eq('is_public', true)
    .or(`expires_at.is.null,expires_at.gte.${today}`)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  // Before the Part 5 migration is run the new columns do not exist yet - stay silent.
  if (error) return [];
  return (data as Announcement[]) ?? [];
}

/** "4 Sep 2026" */
export function noticeDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/** A notice posted within the last 10 days is flagged as new. */
export function isNew(iso: string) {
  return Date.now() - new Date(iso).getTime() < 10 * 24 * 60 * 60 * 1000;
}
