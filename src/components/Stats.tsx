import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { achievements } from '../data';

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
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-6 lg:px-8">
        {achievements.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center text-white"
          >
            <p className="number-font text-3xl font-extrabold text-accent sm:text-4xl">{item.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide">{item.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
