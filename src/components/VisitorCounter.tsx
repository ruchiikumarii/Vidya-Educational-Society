import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Users, X } from 'lucide-react';

const STORAGE_KEY = 'vidya_visitor_count';
const BASE_COUNT = 500;

/**
 * Floating visitor counter shown in the bottom-left corner on every page.
 * Starts at 500 and increments once per browser (stored in localStorage),
 * with a count-up animation on load. A true site-wide total would need a backend.
 */
export function VisitorCounter() {
  const [count, setCount] = useState(BASE_COUNT);
  const [display, setDisplay] = useState(BASE_COUNT);
  const [closed, setClosed] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let stored = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? '', 10);
    if (!Number.isFinite(stored) || stored < BASE_COUNT) {
      stored = BASE_COUNT;
    }
    const next = stored + 1;
    localStorage.setItem(STORAGE_KEY, String(next));
    setCount(next);
  }, []);

  useEffect(() => {
    const duration = 1400;
    const from = Math.max(0, count - 150);
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (count - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  if (closed) return null;

  const digits = String(display).padStart(6, '0').split('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 left-4 z-40"
    >
      <div className="relative flex items-center gap-2.5 border border-white/10 bg-primary px-3 py-2.5 pr-7 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <button
          onClick={() => setClosed(true)}
          aria-label="Close visitor counter"
          className="absolute top-1 right-1 text-white/50 transition-colors hover:text-white"
        >
          <X size={13} />
        </button>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent text-white">
          <Users size={18} />
        </span>

        <div>
          <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-slate-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Total Visitors
          </span>
          <div className="mt-1 flex gap-1" aria-label={`Total visitors: ${display}`}>
            {digits.map((digit, index) => (
              <span
                key={index}
                className="flex h-6 w-4 items-center justify-center bg-primary-dark font-numbers text-sm font-bold text-accent ring-1 ring-white/10"
              >
                {digit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
