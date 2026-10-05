import { useCallback, useEffect, useState } from 'react';
import { Star, Loader2, Building2, BookOpen, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { supabase, type Review } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';
import { courses } from '../../../data';
import { StarInput, Stars } from '../../../components/StarRating';
import { clearReviewCache, INSTITUTE } from '../../../lib/reviews';

/** Student's own ratings: one for the institute, plus one per course. */
export function MyReviews() {
  const { profile } = useAuth();
  const [mine, setMine] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(INSTITUTE);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!supabase || !profile) return;
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('student_id', profile.id)
      .order('created_at', { ascending: false });
    setMine((data as Review[]) ?? []);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    load();
  }, [load]);

  // Picking a course pre-fills whatever the student rated it before.
  useEffect(() => {
    const existing = mine.find((r) => (r.course_slug ?? INSTITUTE) === target);
    setRating(existing?.rating ?? 0);
    setText(existing?.review ?? '');
    setMsg(null);
  }, [target, mine]);

  const existing = mine.find((r) => (r.course_slug ?? INSTITUTE) === target);
  const course = courses.find((c) => c.slug === target);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !profile) return;
    if (!rating) {
      setMsg({ type: 'err', text: 'Please choose a star rating first.' });
      return;
    }
    setBusy(true);
    setMsg(null);

    const row = {
      student_id: profile.id,
      student_name: profile.full_name,
      login_id: profile.login_id,
      course_slug: target === INSTITUTE ? null : target,
      course_title: target === INSTITUTE ? null : (course?.shortTitle ?? null),
      rating,
      review: text.trim() || null,
      // Any new or edited rating goes back to the office for approval.
      status: 'pending' as const,
      featured: false
    };

    const { error } = existing
      ? await supabase.from('reviews').update(row).eq('id', existing.id)
      : await supabase.from('reviews').insert(row);

    setBusy(false);
    if (error) {
      setMsg({
        type: 'err',
        text: `Could not save — ${error.message}. (Office: run SUPABASE_SETUP_PART7.md once.)`
      });
      return;
    }
    clearReviewCache();
    setMsg({
      type: 'ok',
      text: 'Thank you! Your rating has been sent to the office and will appear on the website once approved.'
    });
    await load();
  };

  const remove = async (r: Review) => {
    if (!supabase || !confirm('Delete your rating?')) return;
    await supabase.from('reviews').delete().eq('id', r.id);
    clearReviewCache();
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-white p-6 text-slate-500 shadow-sm">
        <Loader2 size={18} className="animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      {/* ---------------- Rating form ---------------- */}
      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <Star size={18} className="text-accent" /> Rate Us
        </h3>
        <form onSubmit={save} className="mt-4 space-y-4 border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              What are you rating?
            </span>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-1.5 w-full border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value={INSTITUTE}>⭐ The Institute (overall)</option>
              {courses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.shortTitle}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Your rating *
            </span>
            <div className="mt-2">
              <StarInput value={rating} onChange={setRating} />
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Your review (optional)
            </span>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              placeholder="What did you like? How did the teaching help you?"
              className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <span className="mt-1 block text-right text-xs text-slate-400">{text.length}/500</span>
          </label>

          {msg && (
            <p
              className={`border-l-4 px-3 py-2 text-sm ${
                msg.type === 'ok'
                  ? 'border-l-green-600 bg-green-50 text-green-700'
                  : 'border-l-red-600 bg-red-50 text-red-700'
              }`}
            >
              {msg.text}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
            {existing ? 'Update My Rating' : 'Submit Rating'}
          </button>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Your name is shown with the review on the website. The office approves every review
            before it appears.
          </p>
        </form>
      </div>

      {/* ---------------- My ratings so far ---------------- */}
      <div>
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
          <BookOpen size={18} className="text-accent" /> My Ratings ({mine.length})
        </h3>
        {mine.length === 0 ? (
          <p className="mt-4 bg-white p-6 text-sm text-slate-500 shadow-sm">
            You have not rated anything yet. Use the form to rate the institute or a course.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {mine.map((r) => (
              <div key={r.id} className="border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-heading text-sm font-bold text-primary">
                      {r.course_slug ? (
                        <BookOpen size={14} className="text-accent" />
                      ) : (
                        <Building2 size={14} className="text-accent" />
                      )}
                      {r.course_title ?? 'The Institute (overall)'}
                    </p>
                    <span className="mt-1 flex">
                      <Stars value={r.rating} size={14} />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ReviewStatusBadge status={r.status} />
                    <button onClick={() => remove(r)} className="text-slate-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {r.review && <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.review}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ReviewStatusBadge({ status }: { status: Review['status'] }) {
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
        <CheckCircle2 size={11} /> Live on website
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 bg-red-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
        <XCircle size={11} /> Not published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
      <Clock size={11} /> Awaiting approval
    </span>
  );
}
