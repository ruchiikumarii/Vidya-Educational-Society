import { useState } from 'react';
import { Star } from 'lucide-react';
import { RATING_WORDS } from '../lib/reviews';

/**
 * Read-only stars. Supports a fractional value (4.3) by clipping a filled row of
 * stars over a grey one, so the average is shown honestly rather than rounded.
 */
export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = (filled: boolean) => (
    <span className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          className={filled ? 'fill-accent text-accent' : 'fill-slate-200 text-slate-200'}
        />
      ))}
    </span>
  );

  return (
    <span className="relative inline-flex shrink-0" aria-label={`${value} out of 5 stars`}>
      {row(false)}
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row(true)}
      </span>
    </span>
  );
}

/** Clickable 1-5 star picker used in the student's Ratings tab. */
export function StarInput({
  value,
  onChange,
  size = 30
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={size}
              className={n <= shown ? 'fill-accent text-accent' : 'fill-slate-200 text-slate-300'}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-600">
        {shown ? RATING_WORDS[shown] : 'Tap a star'}
      </span>
    </div>
  );
}

/**
 * Compact "★★★★☆ 4.3 (12)" line for course cards. Renders nothing when a course
 * has no ratings yet, so a new course never shows an empty zero-star row.
 */
export function RatingLine({
  average,
  count,
  size = 14,
  className = ''
}: {
  average: number;
  count: number;
  size?: number;
  className?: string;
}) {
  if (count === 0) return null;
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <Stars value={average} size={size} />
      <span className="number-font text-xs font-bold text-primary">{average.toFixed(1)}</span>
      <span className="text-xs text-slate-400">({count})</span>
    </span>
  );
}
