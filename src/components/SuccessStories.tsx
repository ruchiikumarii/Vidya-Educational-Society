import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <article key={s.id} className="card-institutional flex flex-col p-6">
              <Quote size={28} className="text-accent/25" />
              <p className="mt-2 flex-1 text-justify text-sm leading-relaxed text-slate-600">{s.story}</p>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white">
                    {initials(s.name)}
                  </span>
                )}
                <div>
                  <p className="font-heading text-sm font-bold text-primary">{s.name}</p>
                  {s.course && <p className="text-xs text-accent">{s.course}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
