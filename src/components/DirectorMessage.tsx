import { Quote } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { directorMessage } from '../data';

export function DirectorMessage() {
  return (
    <section className="bg-bg-alt py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Director's Message" />

        {/* One unified card: photo panel on the left, message on the right */}
        <div className="mt-10 grid items-stretch overflow-hidden bg-white shadow-lg lg:grid-cols-[300px_1fr]">
          {/* Photo panel */}
          <div className="flex flex-col">
            {directorMessage.image ? (
              <img
                src={directorMessage.image}
                alt={directorMessage.name}
                className="h-[360px] w-full flex-1 object-cover object-top lg:h-auto lg:min-h-0"
              />
            ) : (
              <div className="flex h-[300px] w-full flex-1 items-center justify-center bg-primary lg:h-auto">
                <img src="/logo.png" alt="Vidya Educational Society logo" className="h-28 w-28 object-contain" />
              </div>
            )}
            <div className="bg-primary px-4 py-4 text-center text-white">
              <p className="font-heading text-base font-bold">{directorMessage.name}</p>
              <p className="mt-0.5 text-xs text-slate-300">{directorMessage.designation}</p>
            </div>
          </div>

          {/* Message */}
          <div className="relative flex flex-col justify-center p-6 sm:p-9">
            <Quote size={40} className="text-accent/25" />
            <p className="mt-2 text-sm font-semibold text-primary sm:text-[15px]">{directorMessage.greeting}</p>
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
