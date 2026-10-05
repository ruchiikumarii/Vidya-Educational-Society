import { useEffect, useState } from 'react';
import {
  Star,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Building2,
  BookOpen,
  Sparkles,
  BadgeCheck,
  Globe
} from 'lucide-react';
import { supabase, type Review } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';
import { Stars } from '../../../components/StarRating';
import { summarise, clearReviewCache, INSTITUTE, reviewDate } from '../../../lib/reviews';
import { ReviewStatusBadge } from './MyReviews';
import { PortalTabs } from './PortalTabs';

/** Admin moderation: nothing reaches the website until it is approved here. */
export function ReviewsManager() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Pending');
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [err, setErr] = useState('');

  const load = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setErr(`Could not load reviews — ${error.message}. (Run SUPABASE_SETUP_PART7.md once.)`);
    setItems((data as Review[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (r: Review, status: Review['status']) => {
    if (!supabase) return;
    setWorkingId(r.id);
    setErr('');
    const { error } = await supabase
      .from('reviews')
      .update({
        status,
        // An unpublished review must never stay featured on the home page.
        featured: status === 'approved' ? r.featured : false,
        approved_by_name: profile?.full_name ?? null,
        approved_at: new Date().toISOString()
      })
      .eq('id', r.id);
    setWorkingId(null);
    if (error) {
      setErr(`Could not update — ${error.message}`);
      return;
    }
    clearReviewCache();
    await load();
  };

  const toggleFeatured = async (r: Review) => {
    if (!supabase) return;
    setWorkingId(r.id);
    await supabase.from('reviews').update({ featured: !r.featured }).eq('id', r.id);
    setWorkingId(null);
    clearReviewCache();
    await load();
  };

  const remove = async (r: Review) => {
    if (!supabase || !confirm(`Delete ${r.student_name}'s rating permanently?`)) return;
    await supabase.from('reviews').delete().eq('id', r.id);
    clearReviewCache();
    await load();
  };

  const pending = items.filter((r) => r.status === 'pending');
  const approved = items.filter((r) => r.status === 'approved');
  const rejected = items.filter((r) => r.status === 'rejected');
  const list = tab === 'Pending' ? pending : tab === 'Approved' ? approved : rejected;

  // What the website currently shows.
  const institute = summarise(approved.filter((r) => (r.course_slug ?? INSTITUTE) === INSTITUTE));
  const courseRatings = summarise(approved.filter((r) => r.course_slug));

  return (
    <div>
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
        <Star size={20} className="text-accent" /> Ratings & Reviews
        {pending.length > 0 && (
          <span className="bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {pending.length} to review
          </span>
        )}
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Students rate from their dashboard and visitors from the website. Nothing appears on the
        website until you approve it.
      </p>

      {err && (
        <p className="mt-3 border-l-4 border-l-red-600 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
      )}

      {/* Live summary */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="border-t-4 border-t-accent bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Institute rating (live)
          </p>
          <p className="mt-1 flex items-center gap-2">
            <span className="number-font font-heading text-2xl font-extrabold text-primary">
              {institute.count ? institute.average.toFixed(1) : '—'}
            </span>
            {institute.count > 0 && <Stars value={institute.average} size={15} />}
          </p>
          <p className="text-xs text-slate-400">{institute.count} rating{institute.count === 1 ? '' : 's'}</p>
        </div>
        <div className="border-t-4 border-t-primary bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Course ratings (live)
          </p>
          <p className="mt-1 flex items-center gap-2">
            <span className="number-font font-heading text-2xl font-extrabold text-primary">
              {courseRatings.count ? courseRatings.average.toFixed(1) : '—'}
            </span>
            {courseRatings.count > 0 && <Stars value={courseRatings.average} size={15} />}
          </p>
          <p className="text-xs text-slate-400">
            {courseRatings.count} rating{courseRatings.count === 1 ? '' : 's'} across courses
          </p>
        </div>
        <div className="border-t-4 border-t-amber-500 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Waiting for you</p>
          <p className="mt-1 number-font font-heading text-2xl font-extrabold text-amber-600">
            {pending.length}
          </p>
          <p className="text-xs text-slate-400">new rating{pending.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      <div className="mt-5">
        <PortalTabs
          tabs={[
            { key: 'Pending', label: `Pending (${pending.length})` },
            { key: 'Approved', label: `Approved (${approved.length})` },
            { key: 'Rejected', label: `Rejected (${rejected.length})` }
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : list.length === 0 ? (
        <p className="bg-white p-6 text-sm text-slate-500 shadow-sm">
          {tab === 'Pending' ? 'No new ratings waiting for approval.' : `No ${tab.toLowerCase()} ratings.`}
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className="border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-heading text-sm font-bold text-primary">
                    {r.student_name}
                    {r.student_id ? (
                      <span className="inline-flex items-center gap-1 bg-green-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                        <BadgeCheck size={10} /> Student {r.login_id}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                        <Globe size={10} /> Website visitor
                      </span>
                    )}
                    {r.featured && (
                      <span className="inline-flex items-center gap-1 bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                        <Sparkles size={10} /> Featured
                      </span>
                    )}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    {r.course_slug ? <BookOpen size={13} className="text-accent" /> : <Building2 size={13} className="text-accent" />}
                    {r.course_title ?? 'The Institute (overall)'} · {reviewDate(r.created_at)}
                  </p>
                  {r.contact && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      <span className="font-semibold">Contact:</span> {r.contact}
                    </p>
                  )}
                  <span className="mt-1.5 flex">
                    <Stars value={r.rating} size={15} />
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <ReviewStatusBadge status={r.status} />
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => setStatus(r, 'approved')}
                        disabled={workingId === r.id}
                        className="inline-flex items-center gap-1.5 bg-green-600 px-3 py-1.5 text-xs font-semibold uppercase text-white hover:bg-green-700 disabled:opacity-60"
                      >
                        {workingId === r.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        Approve
                      </button>
                    )}
                    {r.status === 'approved' && (
                      <button
                        onClick={() => toggleFeatured(r)}
                        disabled={workingId === r.id}
                        title={r.featured ? 'Remove from the Home page highlights' : 'Show first on the Home page'}
                        className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold uppercase disabled:opacity-60 ${
                          r.featured
                            ? 'border-accent bg-accent text-white'
                            : 'border-slate-300 text-primary hover:border-accent'
                        }`}
                      >
                        <Sparkles size={13} /> {r.featured ? 'Featured' : 'Feature'}
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        onClick={() => setStatus(r, 'rejected')}
                        disabled={workingId === r.id}
                        className="inline-flex items-center gap-1.5 border border-red-300 px-3 py-1.5 text-xs font-semibold uppercase text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        <XCircle size={13} /> {r.status === 'approved' ? 'Unpublish' : 'Reject'}
                      </button>
                    )}
                    <button onClick={() => remove(r)} className="text-slate-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {r.review && (
                <p className="mt-3 border-l-4 border-l-slate-200 pl-3 text-sm leading-relaxed text-slate-600">
                  {r.review}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
