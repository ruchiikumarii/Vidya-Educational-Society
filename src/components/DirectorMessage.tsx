import { SectionHeading } from './SectionHeading';
import { directorMessage } from '../data';

export function DirectorMessage() {
  return (
    <section className="bg-bg-alt py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Director's Message" />

        {/* One unified card: photo panel on the left, message on the right */}
        <div className="mt-10 grid items-stretch overflow-hidden bg-white shadow-lg lg:grid-cols-[430px_1fr]">
          {/* Full-bleed photo with a gradient name overlay */}
          <div className="relative min-h-[340px] bg-primary sm:min-h-[440px]">
            {directorMessage.image ? (
              <>
                <img
                  src={directorMessage.image}
                  alt={directorMessage.name}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary via-primary/85 to-transparent px-5 pb-5 pt-24 text-white">
                  <p className="font-heading text-lg font-bold">{directorMessage.name}</p>
                  <p className="mt-0.5 text-xs text-slate-200">{directorMessage.designation}</p>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <img src="/logo.png" alt="Vidya Educational Society logo" className="h-28 w-28 object-contain" />
              </div>
            )}
          </div>

          {/* Message */}
          <div className="relative flex flex-col justify-center p-6 sm:p-9">
            <p className="text-sm font-semibold text-primary sm:text-[15px]">{directorMessage.greeting}</p>
            {directorMessage.paragraphs.map((paragraph, i) => (
              <p key={i} className="mt-3 text-justify text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                {paragraph}
              </p>
            ))}
            <p className="mt-5 text-sm text-slate-600 sm:text-[15px]">{directorMessage.closing}</p>
            <p className="mt-1 font-heading text-sm font-bold text-primary">{directorMessage.name}</p>
            <p className="text-xs text-slate-500">{directorMessage.designation}</p>
            <p className="mt-4 border-t border-slate-100 pt-4 text-center font-heading text-sm font-bold italic text-accent">
              “{directorMessage.tagline}”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
