import { useEffect, useState } from 'react';
import { supabase, type Review } from './supabase';

/** Slug used internally for the overall institute rating (course_slug is NULL in the DB). */
export const INSTITUTE = '__institute__';

export interface RatingSummary {
  average: number;
  count: number;
  /** How many 1★, 2★ … 5★ ratings - index 0 is 1★. */
  distribution: number[];
}

export const EMPTY_SUMMARY: RatingSummary = { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };

export function summarise(reviews: Review[]): RatingSummary {
  if (reviews.length === 0) return EMPTY_SUMMARY;
  const distribution = [0, 0, 0, 0, 0];
  let total = 0;
  for (const r of reviews) {
    const stars = Math.min(5, Math.max(1, Math.round(r.rating)));
    distribution[stars - 1] += 1;
    total += stars;
  }
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
    distribution
  };
}

/** Groups approved reviews by course slug; the institute ones land under INSTITUTE. */
export function groupBySlug(reviews: Review[]) {
  const map = new Map<string, Review[]>();
  for (const r of reviews) {
    const key = r.course_slug ?? INSTITUTE;
    const list = map.get(key);
    if (list) list.push(r);
    else map.set(key, [r]);
  }
  return map;
}

async function fetchApproved(): Promise<Review[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  // Before the Part 7 migration is run the table does not exist yet - stay silent.
  if (error) return [];
  return (data as Review[]) ?? [];
}

/**
 * One shared request for the whole page: the home page shows the ratings section and a
 * dozen course cards, and they must not each hit the network.
 */
let cached: Promise<Review[]> | null = null;

export function loadApprovedReviews() {
  if (!cached) cached = fetchApproved();
  return cached;
}

/** Call after a review is approved/rejected in the portal so the website re-reads them. */
export function clearReviewCache() {
  cached = null;
}

export function useApprovedReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadApprovedReviews().then((data) => {
      if (!active) return;
      setReviews(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { reviews, loading };
}

/** Rating for one course slug, or for the institute when slug is omitted. */
export function useRating(slug?: string) {
  const { reviews, loading } = useApprovedReviews();
  const key = slug ?? INSTITUTE;
  const mine = reviews.filter((r) => (r.course_slug ?? INSTITUTE) === key);
  return { summary: summarise(mine), reviews: mine, loading };
}

export const RATING_WORDS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

export function reviewDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}
