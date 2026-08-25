import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { heroSlides } from '../data';

const SLIDE_DURATION = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => goTo(index + 1), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [index, goTo]);

  const slide = heroSlides[index];

  return (
    <section className="relative h-[420px] overflow-hidden bg-primary-dark sm:h-[500px] lg:h-[560px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/80 to-primary-dark/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              {slide.badge}
            </span>
            <h1 className="mt-5 font-heading text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
              {slide.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={slide.primaryCta.to} className="btn-accent">
                {slide.primaryCta.label}
              </Link>
              <Link
                to={slide.secondaryCta.to}
                className="inline-flex items-center justify-center border-2 border-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-primary"
              >
                {slide.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / next controls */}
      <button
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute top-1/2 left-2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/15 text-white backdrop-blur transition-colors hover:bg-accent sm:flex lg:left-4"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute top-1/2 right-2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/15 text-white backdrop-blur transition-colors hover:bg-accent sm:flex lg:right-4"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {heroSlides.map((item, i) => (
          <button
            key={item.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'h-2 transition-all duration-300',
              i === index ? 'w-8 bg-accent' : 'w-2 bg-white/50 hover:bg-white'
            )}
          />
        ))}
      </div>
    </section>
  );
}
