import { useState } from 'react';
import { PenLine, Loader2, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { courses } from '../data';
import { StarInput } from './StarRating';
import { INSTITUTE, clearReviewCache } from '../lib/reviews';

/**
 * "Write a Review" dialog for website visitors - no login needed.
 * The review is stored as 'pending' and stays invisible until an admin approves it.
 */
export function ReviewForm({
  initialSlug,
  onClose
}: {
  initialSlug?: string;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [target, setTarget] = useState(initialSlug ?? INSTITUTE);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErr('Reviews are not available right now. Please try again later.');
      return;
    }
    if (!rating) {
      setErr('Please choose a star rating.');
      return;
    }
    setBusy(true);
    setErr('');

    const course = courses.find((c) => c.slug === target);
    const { error } = await supabase.from('reviews').insert({
      student_id: null,
      student_name: name.trim(),
      contact: contact.trim() || null,
      course_slug: target === INSTITUTE ? null : target,
      course_title: target === INSTITUTE ? null : (course?.shortTitle ?? null),
      rating,
      review: text.trim().slice(0, 500) || null,
      status: 'pending',
      featured: false
    });
    setBusy(false);

    if (error) {
      setErr(`Could not send your review — ${error.message}`);
      return;
    }
    clearReviewCache();
    setDone(true);
  };

  const inputClass =
    'mt-1.5 w-full border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none';
  const labelClass = 'text-xs font-semibold uppercase tracking-wide text-slate-600';

  return (
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-slate-900/70 p-4"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 bg-primary px-5 py-3.5">
          <h3 className="flex items-center gap-2 font-heading text-base font-bold text-white">
            <PenLine size={18} className="text-accent" /> Write a Review
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={42} className="mx-auto text-green-600" />
            <h4 className="mt-4 font-heading text-lg font-bold text-primary">Thank you!</h4>
            <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-slate-600">
              Your review has been sent to the institute. It will appear on the website once our
              office has checked and approved it.
            </p>
            <button onClick={onClose} className="btn-primary mt-6 px-8 text-xs">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 p-5">
            <label className="block">
              <span className={labelClass}>Your Name *</span>
              <input
                required
                minLength={2}
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>
                Phone or Email <span className="font-normal normal-case text-slate-400">(optional, not shown on the website)</span>
              </span>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="So we can confirm it is genuine"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>What are you rating?</span>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className={`${inputClass} bg-white`}
              >
                <option value={INSTITUTE}>The Institute (overall)</option>
                {courses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.shortTitle}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className={labelClass}>Your Rating *</span>
              <div className="mt-2">
                <StarInput value={rating} onChange={setRating} size={28} />
              </div>
            </div>

            <label className="block">
              <span className={labelClass}>
                Your Review <span className="font-normal normal-case text-slate-400">(optional)</span>
              </span>
              <textarea
                rows={4}
                maxLength={500}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What was your experience with the institute or the course?"
                className={inputClass}
              />
              <span className="mt-1 block text-right text-xs text-slate-400">{text.length}/500</span>
            </label>

            {err && (
              <p className="border-l-4 border-l-red-600 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
            )}

            <p className="border-l-4 border-l-accent bg-bg-alt px-3 py-2 text-xs leading-relaxed text-slate-600">
              Your name and review will be shown on the website after our office approves it. Your
              phone / email is never published.
            </p>

            <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <PenLine size={16} />}
              {busy ? 'Sending…' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
