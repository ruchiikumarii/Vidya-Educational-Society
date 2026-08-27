import { useEffect, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { supabase, type SuccessStory } from '../lib/supabase';

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export function SuccessStories() {
  const [items, setItems] = useState<SuccessStory[]>([]);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase!
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setItems(data as SuccessStory[]);
    })();
  }, []);

  // Hide the whole section when there are no stories yet.
  if (items.length === 0) return null;

  return (
    <section className="bg-bg-alt py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Success Stories"
          subtitle="Our students, their journey and achievements at Vidya Educational Society (NEURON)."
        />

        <div className="mt-12 grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <article
              key={s.id}
              className="card-institutional relative flex w-full max-w-sm flex-col items-center px-6 pb-7 pt-14 text-center"
            >
              {/* Photo overlapping the top of the card */}
              <div className="absolute -top-11 left-1/2 -translate-x-1/2">
                {s.image_url ? (
                  <img
                    src={s.image_url}
                    alt={s.name}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover object-top shadow-lg"
                  />
                ) : (
                  <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary font-heading text-2xl font-bold text-white shadow-lg">
                    {initials(s.name)}
                  </span>
                )}
              </div>

              <h3 className="font-heading text-lg font-bold text-primary">{s.name}</h3>
              {s.course && (
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-accent">{s.course}</p>
              )}

              <span className="mx-auto mt-3 h-0.5 w-10 bg-accent/40" />
              <p className="mt-4 line-clamp-6 text-justify text-sm italic leading-relaxed text-slate-600">
                “{s.story}”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
