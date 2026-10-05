import { useCallback, useEffect, useRef, useState } from 'react';
import { Quote, BadgeCheck, Star, PenLine, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Stars } from './StarRating';
import { ReviewForm } from './ReviewForm';
import { useApprovedReviews, summarise, INSTITUTE, reviewDate, initials } from '../lib/reviews';

/**
 * "Student Ratings" section on the Home page: the overall score out of 5, the
 * 5★…1★ breakdown, the best reviews, and a Write a Review button for visitors.
 */
export function InstituteRating() {
  const { reviews } = useApprovedReviews();
  const [writing, setWriting] = useState(false);

  const institute = reviews.filter((r) => (r.course_slug ?? INSTITUTE) === INSTITUTE);
  const summary = summarise(institute);

  // Written reviews read best on the cards; featured ones come first (the query sorts them).
  // All of them are shown - the carousel pages through once they stop fitting on one row.
  const cards = reviews.filter((r) => r.review && r.review.trim().length > 0);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Ratings & Reviews"
          subtitle="What our students and visitors say about Vidya Educational Society (NEURON). Every review is checked by our office before it is published."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* ---------- Overall score ---------- */}
          <div className="border-t-4 border-t-accent bg-bg-alt p-7 text-center shadow-sm">
            {summary.count > 0 ? (
              <>
                <p className="number-font font-heading text-6xl leading-none font-extrabold text-primary">
                  {summary.average.toFixed(1)}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">out of 5</p>

                <span className="mt-4 flex justify-center">
                  <Stars value={summary.average} size={24} />
                </span>

                <p className="mt-3 text-center text-sm text-slate-600">
                  Based on <strong className="text-primary">{summary.count}</strong>
                  {summary.count === 1 ? ' rating' : ' ratings'}
                </p>

                <div className="mt-6 space-y-1.5 text-left">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const n = summary.distribution[star - 1];
                    const pct = summary.count ? (n / summary.count) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="flex w-8 shrink-0 items-center gap-0.5 text-xs font-semibold text-slate-500">
                          {star}
                          <Star size={10} className="fill-accent text-accent" />
                        </span>
                        <span className="h-2 flex-1 bg-slate-200">
                          <span className="block h-full bg-accent" style={{ width: `${pct}%` }} />
                        </span>
                        <span className="number-font w-6 shrink-0 text-right text-xs text-slate-500">{n}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <span className="flex justify-center">
                  <Stars value={0} size={26} />
                </span>
                <p className="mt-4 text-center text-sm leading-relaxed text-slate-600">
                  No ratings yet. Be the first to tell others about your experience.
                </p>
              </>
            )}

            <button onClick={() => setWriting(true)} className="btn-accent mt-7 w-full text-xs">
              <PenLine size={15} /> Write a Review
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Open to everyone — no login needed
            </p>
          </div>

          {/* ---------- Review cards ---------- */}
          <div>
            {cards.length === 0 ? (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center border border-dashed border-slate-300 bg-bg-alt p-8 text-center">
                <Quote size={28} className="text-accent/40" />
                <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-slate-500">
                  No reviews have been published yet. Share your experience and help other students
                  choose the right course.
                </p>
                <button onClick={() => setWriting(true)} className="btn-primary mt-5 px-6 text-xs">
                  <PenLine size={15} /> Write the First Review
                </button>
              </div>
            ) : (
              <ReviewCarousel>
                {cards.map((r) => (
                  <article
                    key={r.id}
                    className="card-institutional flex w-[85%] shrink-0 snap-start flex-col p-5 sm:w-[calc(50%-10px)] xl:w-[calc(33.333%-14px)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Stars value={r.rating} size={15} />
                      <Quote size={20} className="shrink-0 text-accent/30" />
                    </div>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{r.review}</p>

                    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xs font-bold text-white">
                        {initials(r.student_name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 font-heading text-sm font-bold text-primary">
                          <span className="truncate">{r.student_name}</span>
                          {r.student_id && (
                            <BadgeCheck
                              size={14}
                              className="shrink-0 text-green-600"
                              aria-label="Verified student"
                            />
                          )}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {r.course_title ?? 'Institute'} · {reviewDate(r.created_at)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </ReviewCarousel>
            )}
          </div>
        </div>
      </div>

      {writing && <ReviewForm onClose={() => setWriting(false)} />}
    </section>
  );
}

/**
 * Horizontal, snap-scrolling row of review cards. Once the reviews stop fitting on
 * one screen the arrows and dots appear and page through the rest; with only a
 * couple of reviews it looks exactly like a plain row.
 */
function ReviewCarousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const total = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(total);
    setPage(Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, children]);

  const goTo = (p: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      <div
        ref={track}
        onScroll={measure}
        className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1"
      >
        {children}
      </div>

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => goTo(Math.max(0, page - 1))}
            disabled={page === 0}
            aria-label="Previous reviews"
            className="flex h-9 w-9 items-center justify-center border border-slate-300 text-primary transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-slate-300 disabled:hover:text-primary"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Reviews page ${i + 1}`}
                className={`h-2 transition-all ${i === page ? 'w-6 bg-accent' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(Math.min(pages - 1, page + 1))}
            disabled={page === pages - 1}
            aria-label="More reviews"
            className="flex h-9 w-9 items-center justify-center border border-slate-300 text-primary transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-slate-300 disabled:hover:text-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
