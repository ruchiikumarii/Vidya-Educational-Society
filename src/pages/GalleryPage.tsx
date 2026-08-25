import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { CtaStrip } from '../components/CtaStrip';
import { cn } from '../lib/utils';
import { galleryImages, instituteVideo, type GalleryImage } from '../data';
import { supabase } from '../lib/supabase';

const categories = ['All', 'Campus', 'Classroom', 'Students', 'Events'] as const;

export function GalleryPage() {
  const [active, setActive] = useState<(typeof categories)[number]>('All');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [dynamic, setDynamic] = useState<GalleryImage[]>([]);

  // Load any photos the admin added from the dashboard (if Supabase is configured).
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase!
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setDynamic(
          data.map((d: { id: string; image_url: string; category: string; caption: string | null }) => ({
            id: d.id,
            url: d.image_url,
            category: (d.category as GalleryImage['category']) ?? 'Events',
            alt: d.caption ?? d.category
          }))
        );
      }
    })();
  }, []);

  const allImages = [...dynamic, ...galleryImages];
  const visible: GalleryImage[] =
    active === 'All' ? allImages : allImages.filter((img) => img.category === active);

  return (
    <>
      <PageHeader
        title="Photo Gallery"
        subtitle="A look at our campus, classrooms, students and events at Vidya Educational Society (NEURON), Keonjhar."
        image="/images/group-students.jpg"
      />

      {/* Institute video */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Institute Video" subtitle="Watch a short walkthrough of our institute." />
          <div className="mt-8 overflow-hidden bg-black shadow-lg">
            <video className="h-full w-full" controls preload="none" poster={instituteVideo.poster}>
              <source src={instituteVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-bg-alt py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Photos" />

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActive(category)}
                className={cn(
                  'border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                  active === category
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-300 text-slate-600 hover:border-primary hover:text-primary'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((image) => (
              <button
                key={image.id}
                onClick={() => setLightbox(image.url)}
                className="group relative aspect-[4/3] overflow-hidden bg-slate-200"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-primary/85 px-3 py-2 text-left text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {image.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center bg-white/15 text-white hover:bg-accent"
          >
            <X size={22} />
          </button>
          <img src={lightbox} alt="" className="max-h-[85vh] max-w-full object-contain" />
        </div>
      )}

      <CtaStrip />
    </>
  );
}
