import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Users, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FALLBACK_COUNT = 559;

/**
 * Floating visitor counter (bottom-left). Uses a single shared count stored in
 * Supabase (table `site_stats` + function `increment_visits`) so every visitor
 * sees the same number, and it increments by 1 on each website visit.
 * If Supabase is not reachable it shows a static fallback.
 */
export function VisitorCounter() {
  const [count, setCount] = useState(FALLBACK_COUNT);
  const [display, setDisplay] = useState(FALLBACK_COUNT);
  const [closed, setClosed] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (supabase) {
        const { data, error } = await supabase.rpc('increment_visits');
        if (!cancelled && !error && data != null) {
          setCount(Number(data));
          return;
        }
      }
      if (!cancelled) setCount(FALLBACK_COUNT);
    })();
    return () => {
      cancelled = true;
    };
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
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
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
      className="fixed bottom-16 left-3 z-40 lg:bottom-4 lg:left-4"
    >
      <div className="relative flex items-center gap-2.5 border border-white/10 bg-primary px-3 py-2.5 pr-7 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <button
          onClick={() => setClosed(true)}
          aria-label="Close visitor counter"
          className="absolute top-1 right-1 text-white/50 transition-colors hover:text-white"
        >
          <X size={13} />
        </button>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent text-primary-dark">
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
