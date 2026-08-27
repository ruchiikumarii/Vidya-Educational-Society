import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { achievements } from '../data';

/** Split "28+" -> { prefix: "", num: 28, suffix: "+" }, "1997" -> { num: 1997 }. */
function parseValue(value: string) {
  const match = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  if (!match) return { prefix: '', num: null as number | null, suffix: value };
  return {
    prefix: match[1],
    num: parseInt(match[2].replace(/,/g, ''), 10),
    suffix: match[3]
  };
}

function CountUp({ value, run }: { value: string; run: boolean }) {
  const { prefix, num, suffix } = parseValue(value);
  const [display, setDisplay] = useState(num === null ? value : '0');
  const started = useRef(false);

  useEffect(() => {
    if (!run || num === null || started.current) return;
    started.current = true;

    const duration = 1600;
    let startTs: number | null = null;
    let frame = 0;

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      // easeOutCubic for a natural slow-down near the end
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);
      setDisplay(`${prefix}${current.toLocaleString('en-IN')}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, num, prefix, suffix]);

  return <>{display}</>;
}

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary py-14">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
        {achievements.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center text-white"
          >
            <p className="number-font text-3xl font-extrabold text-accent sm:text-4xl">
              <CountUp value={item.value} run={isInView} />
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide">{item.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
